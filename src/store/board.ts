import * as fabric from 'fabric';
import { ActionMode } from '@/constants';
import { DrawType } from '@/constants/draw';
import {
  changeAlpha,
  getAlphaFromRgba,
  getColorFormat,
  hexToRgba
} from '@/utils/common/color';
import { paintBoard } from '@/utils/paintBoard';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alignGuideLine } from '@/utils/common/fabricMixin/alignGuideLine';
import {
  updateCanvasBackgroundImage,
  handleBackgroundImageWhenCanvasSizeChange
} from '@/utils/common/background';

// BoardState 타입 정의
interface BoardState {
  mode: ActionMode; // operating mode
  drawType: DrawType; // draw type
  language: 'en' | 'zh'; // i18n language 'zh' 'en'
  canvasWidth: number; // canvas width 0.1 ~ 1
  canvasHeight: number; // canvas height 0.1 ~ 1
  backgroundColor: string; // canvas background color
  backgroundOpacity: number; // canvas background color opacity
  hasBackgroundImage: boolean; // canvas background image
  backgroundImageOpacity: number; // canvas background image opacity
  isObjectCaching: boolean; // fabric objectCaching
  openGuideLine: boolean; // does the guide line show
}

// BoardAction 타입 정의
interface BoardAction {
  updateMode: (mode: ActionMode) => void;
  updateDrawType: (drawType: DrawType) => void;
  updateLanguage: (language: 'en' | 'zh') => void;
  initBackground: () => void;
  updateCanvasWidth: (width: number) => void;
  updateCanvasHeight: (height: number) => void;
  updateBackgroundColor: (color: string) => void;
  updateBackgroundOpacity: (opacity: number) => void;
  updateBackgroundImage: (image: string) => void;
  updateBackgroundImageOpacity: (opacity: number) => void;
  cleanBackgroundImage: () => void;
  updateCacheState: () => void;
  updateOpenGuideLine: () => void;
}

// 기본 언어 설정
const initLanguage: 'en' | 'zh' = ['en', 'en-US', 'en-us'].includes(navigator.language)
    ? 'en'
    : 'zh';

// 상태 관리 스토어 생성
const useBoardStore = create<BoardState & BoardAction>()(
    persist(
        (set, get) => ({
          mode: ActionMode.DRAW,
          drawType: DrawType.FreeStyle,
          language: initLanguage,
          canvasWidth: 1,
          canvasHeight: 1,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          backgroundOpacity: 1,
          hasBackgroundImage: false,
          backgroundImageOpacity: 1,
          isObjectCaching: true,
          openGuideLine: false,

          updateMode: (mode: ActionMode) => {
            const oldMode = get().mode;
            if (oldMode !== mode) {
              paintBoard.handleMode(mode);
              set({
                mode,
              });
            }
          },

          updateDrawType: (drawType: DrawType) => {
            const oldDrawType = get().drawType;
            if (oldDrawType !== drawType) {
              set({
                drawType,
              });
              paintBoard.handleMode();
            }
          },

          updateLanguage: (language: 'en' | 'zh') => {
            set({
              language,
            });
          },

          initBackground: () => {
            const backgroundColor = paintBoard?.canvas?.backgroundColor;
            if (backgroundColor && typeof backgroundColor === 'string') {
              const type = getColorFormat(backgroundColor);
              if (type === 'hex') {
                const color = hexToRgba(backgroundColor);
                const opacity = getAlphaFromRgba(color);
                set({
                  backgroundColor: color,
                  backgroundOpacity: opacity,
                });
              } else if (type === 'rgba') {
                const opacity = getAlphaFromRgba(backgroundColor);
                set({
                  backgroundColor: backgroundColor,
                  backgroundOpacity: opacity,
                });
              }
            } else if (paintBoard?.canvas) {
              paintBoard.canvas.backgroundColor = 'rgba(255, 255, 255, 1)';
              set({
                backgroundColor: 'rgba(255, 255, 255, 1)',
                backgroundOpacity: 1,
              });
            }

            const backgroundImage = paintBoard?.canvas
                ?.backgroundImage as fabric.Image;
            if (backgroundImage) {
              handleBackgroundImageWhenCanvasSizeChange();
              set({
                hasBackgroundImage: true,
                backgroundOpacity: backgroundImage.opacity,
              });
            } else {
              set({
                hasBackgroundImage: false,
                backgroundOpacity: 1,
              });
            }
          },

          updateCanvasWidth: (width: number) => {
            const oldWidth = get().canvasWidth;
            if (oldWidth !== width) {
              set({
                canvasWidth: width,
              });
              paintBoard.updateCanvasWidth(width);
            }
          },

          updateCanvasHeight: (height: number) => {
            const oldHeight = get().canvasHeight;
            if (oldHeight !== height) {
              set({
                canvasHeight: height,
              });
              paintBoard.updateCanvasHeight(height);
            }
          },

          updateBackgroundColor: (color: string) => {
            const canvas = paintBoard.canvas;
            if (canvas && color !== canvas?.backgroundColor) {
              set((state) => {
                const bgColor = hexToRgba(color, state.backgroundOpacity);
                canvas.backgroundColor = bgColor;
                return {
                  backgroundColor: bgColor,
                };
              });
            }
          },

          updateBackgroundOpacity: (opacity: number) => {
            set((state) => {
              const canvas = paintBoard.canvas;
              if (canvas && opacity !== state.backgroundOpacity) {
                const newColor = changeAlpha(state.backgroundColor, opacity);
                canvas.backgroundColor = newColor;
                return {
                  backgroundOpacity: opacity,
                  backgroundColor: newColor,
                };
              }
              return {};
            });
          },

          updateBackgroundImage: (image: string) => {
            const canvas = paintBoard.canvas;
            const oldBackgroundImage = canvas?.backgroundImage as fabric.Image;
            if (canvas && image !== oldBackgroundImage.getSrc()) {
              updateCanvasBackgroundImage(image);
              set({
                hasBackgroundImage: true,
              });
            }
          },

          cleanBackgroundImage: () => {
            set({
              hasBackgroundImage: false,
            });
            const canvas = paintBoard.canvas;
            if (canvas) {
              canvas.setBackgroundImage(null as unknown as string, () => {
                paintBoard.render();
              });
            }
          },

          updateBackgroundImageOpacity: (opacity: number) => {
            set((state) => {
              const canvas = paintBoard.canvas;
              if (canvas && opacity !== state.backgroundImageOpacity) {
                const backgroundImage = canvas?.backgroundImage as fabric.Image;
                if (backgroundImage) {
                  backgroundImage.set({
                    opacity,
                  });
                }

                return {
                  backgroundImageOpacity: opacity,
                };
              }
              return {};
            });
          },

          updateCacheState: () => {
            const oldCacheState = get().isObjectCaching;
            set({
              isObjectCaching: !oldCacheState,
            });
            fabric.Object.prototype.set({
              objectCaching: useBoardStore.getState().isObjectCaching,
            });
            paintBoard?.canvas?.renderAll();
          },

          updateOpenGuideLine: () => {
            const newOpenGuideLine = !get().openGuideLine;
            set({
              openGuideLine: newOpenGuideLine,
            });
            alignGuideLine.updateOpenState(newOpenGuideLine);
          },
        }),
        {
          name: 'PAINT-BOARD-STORE',
        }
    )
);

export default useBoardStore;

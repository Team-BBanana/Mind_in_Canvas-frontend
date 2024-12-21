// declarations.d.ts 또는 custom.d.ts
declare module '*.svg?react' {
    import { FC, SVGProps } from 'react';
    const ReactComponent: FC<SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

import type { ThemeInput } from 'shiki';

declare module '*.json' {
    const value: ThemeInput;
    export default value;
}

export {};

/// <reference types="react" />
declare module "*.svg?react" {
  // This is important to make the SVG work as a React component
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

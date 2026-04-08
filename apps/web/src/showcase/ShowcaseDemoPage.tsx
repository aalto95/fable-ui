import { Renderer } from "fable-ui";
import { useParams } from "react-router";

import { NotFound } from "../components/app/NotFound.tsx";
import { getShowcaseUi } from "./showcase-demos";

export const ShowcaseDemoPage: React.FC = () => {
  const { kind } = useParams<{ kind: string }>();
  const ui = kind ? getShowcaseUi(kind) : null;
  if (!ui) {
    return <NotFound />;
  }
  return <Renderer ui={ui} />;
};

import { LaunchBrowserTask } from "./LaunchBrowser";
import { ExtractTextFromElementTask} from "./ExtractTextFromElement";
import { PageToHtmlTask } from "./PageToHtml";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";

type Registry = {
    [K in TaskType]: WorkflowTask & { type: K };
}

export const TaskRegistry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask
};

import ReactQuill from "react-quill-new";
import { forwardRef } from "react";

const QuillEditor = forwardRef<ReactQuill, any>((props, ref) => {
  return <ReactQuill {...props} ref={ref as any} />;
});

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;

// This wrapper is needed to avoid ReactQuill's ref forwarding issues when used in BlogEditor
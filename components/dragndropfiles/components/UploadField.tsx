import Grid from "@mui/material/Grid";
import { FunctionComponent } from "react";
import { FileUploader } from "react-drag-drop-files";

import {
  FileUploaderDiv,
} from "./styledComponents";
import { UploadFileOutlined } from "@mui/icons-material";

interface Props {
  fileChangeHandler: (file: FileList) => void;
}
export const UploadField: FunctionComponent<Props> = ({ fileChangeHandler }) => {
  return (
    <FileUploader multiple={true} handleChange={fileChangeHandler} name="file">
      <FileUploaderDiv>
        <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}>
            <UploadFileOutlined />
          </Grid>
          <Grid item xs={8}>
            Click or drag files here
          </Grid>
        </Grid>
      </FileUploaderDiv>
    </FileUploader>
  );
};

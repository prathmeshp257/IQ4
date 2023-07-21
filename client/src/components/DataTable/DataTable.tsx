import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import ProgressBar from "../../screens/Reports/ProgressBar";

interface Props {
  data: Array<any>;
  columns: Array<string>;
  title?: string;
  subTitle?: string;
  loading: Boolean;
  pagination: Boolean;
  count?: number;
  rowsPerPage?: number;
  page?: number;
  type?:string;
  handleChangePage?: Function;
  filters?: React.ReactNode;
  onClick?: (type: any, data: any) => void;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: 10,
    borderRadius: "10px",
  },
  container: {
    minHeight: 200,
    maxHeight: 400,
  },
});

export const DataTable: FC<Props> = ({
  data,
  loading,
  title,
  columns,
  pagination,
  count,
  rowsPerPage,
  page,
  handleChangePage,
  subTitle,
  filters,
  type,
  onClick,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <div
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            display: "inline-block",
          }}
        >
          {title && <h3>{title}</h3>}
          {subTitle && (
            <h4 style={{ marginBottom: "20px", marginTop: "20px" }}>
              {subTitle}
            </h4>
          )}
        </div>
        {filters && (
          <div
            style={{ marginBottom: "20px", marginTop: "20px", float: "right" }}
          >
            {filters}
          </div>
        )}
        {loading ? (
          <div
            style={{
              height: "300px",
              width: "100%",
              textAlign: "center",
              padding: "auto",
            }}
          >
            <ProgressBar />
          </div>
        ) : (
          <React.Fragment>
            <TableContainer className={type!="dialog"?classes.container:''}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns &&
                      columns[0] &&
                      columns.map((columnName) => {
                        return <TableCell rowSpan={2}>{columnName}</TableCell>;
                      })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data[0] &&
                    data.map((eachData) => {
                      return (
                        <TableRow>
                          {columns &&
                            columns[0] &&
                            columns.map((column) => {
                              const plateSrc =
                                column === "Plate"
                                  ? `data:image/png;base64,${eachData[column]}`
                                  : "";
                              return (
                                <TableCell>
                                  {column === "Plate" ? (
                                    <img
                                      height={40}
                                      width={130}
                                      src={plateSrc}
                                      alt="NA"
                                    />
                                  ) : column === "Overview" ? (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={`${eachData[column]}`}
                                    >
                                      Open Image
                                    </a>
                                  ) : (
                                    
                                    eachData[column] || "NA"
                                  )}
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {pagination ? (
              <TablePagination
                component="div"
                count={count || 0}
                rowsPerPage={rowsPerPage || 50}
                page={page || 0}
                backIconButtonProps={loading ? { disabled: true } : undefined}
                nextIconButtonProps={loading ? { disabled: true } : undefined}
                onChangePage={async (e, page) => {
                  if (handleChangePage) await handleChangePage(page);
                }}
                labelRowsPerPage=""
                rowsPerPageOptions={[]}
              />
            ) : (
              ""
            )}
          </React.Fragment>
        )}
      </Paper>
    </React.Fragment>
  );
};

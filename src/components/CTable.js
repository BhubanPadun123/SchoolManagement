import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    textTransform: "capitalize",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer",
  },
}));

/**
 * Reusable Table Component
 *
 * @param {Array} header - Array of header labels
 * @param {Array} rows - Array of row data objects
 * @param {Array} columns - Array of column keys (optional)
 * @param {Function|JSX.Element} renderActions - Either a function (row, index) => JSX or a fixed JSX element
 * @param {Function} onRowClick - Callback function when a row is clicked, e.g. (row) => {}
 */

const CTable = ({
  header = [],
  rows = [],
  columns = [],
  renderActions,
  onRowClick,
}) => {
  const columnKeys =
    columns.length > 0
      ? columns
      : rows.length > 0
        ? Object.keys(rows[0])
        : [];

  const isFunction = typeof renderActions === "function"

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table sx={{ minWidth: 650 }} aria-label="custom table">
        <TableHead>
          <TableRow>
            {header.map((head, idx) => (
              <StyledTableCell key={idx}>{head}</StyledTableCell>
            ))}
            {renderActions && (
              <StyledTableCell align="center">Actions</StyledTableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <StyledTableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)} // 👈 send row data to parent
              >
                {columnKeys.map((key, colIndex) => {
                  if(!row[key]) return null
                  return (
                    <StyledTableCell key={colIndex}>
                      {row[key] ?? "-"}
                    </StyledTableCell>
                  )
                }
                )}
                {renderActions && (
                  <StyledTableCell align="center">
                    {isFunction
                      ? renderActions(row, rowIndex)
                      : React.cloneElement(renderActions)}
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={header.length + 1} align="center">
                No data available
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CTable;

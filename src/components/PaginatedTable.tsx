import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

import { ReactNode } from "react";

type Column = {
  id: string;
  label: string;
};

type PaginatedTableProps<T> = {
  title: string;
  columns: Column[];
  data: T[];
  renderRow: (item: T) => ReactNode;
};

export function PaginatedTable<T>({
  title,
  columns,
  data,
  renderRow,
}: PaginatedTableProps<T>) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 0, border: "none" }}
    >
      <Typography
        fontWeight={700}
        variant="h6"
        className="px-4 p-8 pb-6 font-bold border-b border-gray-200"
      >
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                className="uppercase font-bold text-sm"
                key={column.id}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>{renderRow(item)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

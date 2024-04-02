import {useState} from 'react';
import Button from '@mui/material/Button';
import ActionButton from './actionsButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import "./table.css";


export default function DataTable(props) {
    const [selectedRowId, setSelectedRowId] = useState(null);

  const handleRowClick = (ocid,domain) => {
    props.showRecords(ocid,domain);
  };
    
  return (
    
    <div className="table-container" style={{ width: '80%' }} >
      <div className="table-header">
        <Button variant="contained" style={{ marginLeft:'10px' , marginRight: '10px' }} onClick={props.addRecord}>Add {props.add}</Button>
        
      </div>
      <div className="table">
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {props.cols.map((column) => (
                            <TableCell key={column.id}>{column.headerName}</TableCell>
                        ))}
                            <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ cursor: 'pointer' }} // Add cursor pointer for better UX
                            selected={selectedRowId === row.id} // Highlight selected row
                        >
                            {props.cols.map((column) => (
                                <TableCell onClick={() => handleRowClick(row.ocid,row.domain)} key={column.id}>{row[column.field]}</TableCell>
                            ))}
                            <TableCell>
                                {
                                    props.add !== "RECORDS" && (
                                        <Button onClick={() => props.onDelete(row.ocid)}><DeleteOutlineIcon></DeleteOutlineIcon></Button>
                                    )
                                }
                                {
                                    props.add == "COMPARTMENT" && (
                                        <Button onClick={() => props.onEdit(row.ocid)}><EditIcon></EditIcon></Button>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
      </TableContainer>
      </div>
    </div>
  );
}

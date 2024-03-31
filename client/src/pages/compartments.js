import { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import DataTable from "../components/table.js";
import "./compartments.css";
import { Button, Modal, TextField, Alert } from '@mui/material';

const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "state", headerName: "State", flex: 1 },
];

export default function Compartments() {
    const navigate = useNavigate();
    const [compartmentData, setCompartmentData] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [editCompartment, setEditCompartment] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);

    const host = process.env.REACT_APP_HOST;
    const handleClick = (ocid,domain) => {
        const compartmentID = ocid;
        navigate("/zones/"+compartmentID);
    }

    const handleDelete = async (ocid) => {
        try {
            const response = await axios.delete(`${host}/deletecompartment/${ocid}`);
            console.log(response.data);
            fetchCompartmentData();
        } catch (error) {
            console.error('Error deleteing Compartment:' , error);
        }
    }

    const handleEditModalOpen = (ocid) => {
        const compartment = compartmentData.find(compartment => compartment.ocid === ocid);
        if (compartment) {
            setEditCompartment(ocid);
            setEditName(compartment.name);
            setEditDescription(compartment.description);
            setEditModalOpen(true);
        }
    };
    
    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setEditCompartment(null);
        setEditName('');
        setEditDescription('');
    };

    const handleUpdateCompartment = async () => {
        if (!editName || !editDescription) {
            setError("Name and Description cannot be empty");
            return;
        }
    
        try {
            await axios.post(`${host}/updatecompartment/${editCompartment}`, { name: editName, description: editDescription });
            handleEditModalClose();
            fetchCompartmentData();
        } catch (error) {
            console.error('Error updating compartment:', error);
        }
    };
    
    

    const handleCancel = () => {
        setOpen(false);
        setName('');
        setDescription('');
        setError(null);
    }

    const handleCreate = async () => {
        if (!name || !description) {
            setError("Name and Description cannot be empty");
            return;
        }

        try {
            const response = await axios.post(`${host}/createcompartment`, { name, description });
            console.log(response.data); // Handle response as needed
            setOpen(false);
            setName('');
            setDescription('');
            setError(null);
            fetchCompartmentData();
        } catch (error) {
            console.error('Error creating compartment:', error);
        }
    }

    const handleOpenModal = () => {
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
        setError(null);
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    }

    const fetchCompartmentData = async () => {
        try {
            const response = await axios.get(`${host}/compartmentlist`);
            const compartmentRows = response.data.data.items;
            const formattedRows = compartmentRows.map((compartment, index) => ({
                id: index + 1,
                name: compartment.name,
                ocid: compartment.id,
                description: compartment.description,
                state: compartment.lifecycleState,
              }));
            setCompartmentData(formattedRows);
        } catch (error) {
            console.error('Error fetching compartment data:', error);
        }
    }

    useEffect(() => {
        fetchCompartmentData();
    }, []);

    return (
        <div>
            <div className="component-container">
                <h1 >All Compartments</h1>
                <Modal open={open} onClose={handleCloseModal}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                        
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </div>
                </Modal>
                <Modal open={editModalOpen} onClose={handleEditModalClose}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
                        <TextField label="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} fullWidth />
        
                        <Button onClick={handleEditModalClose}>Cancel</Button>
                        <Button onClick={handleUpdateCompartment}>Update</Button>
                    </div>
                </Modal>

                <DataTable addRecord={handleOpenModal} onDelete={handleDelete} showRecords={handleClick} onEdit={handleEditModalOpen}  add="COMPARTMENT" cols={columns} rows={compartmentData} />
            </div>
        </div>
    );
}

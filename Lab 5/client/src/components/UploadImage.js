import React, { useState, useEffect } from "react";
import '../App.css';
import { Box, TextField, Button } from '@mui/material';
import { makeStyles } from "@mui/styles";
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';


const UploadImage = () => {
    const [description, setDescription] = useState("");
    const [url, setURL] = useState("");
    const [posterName, setPosterName] = useState("");
    const [uploadImage, {data, loading, error}] = useMutation(queries.UPLOAD_IMAGE);

    if(error){
        return (
            <div>{error}</div>
        )
    }
    return (
        <div className="uploadFormDiv">
            <Box className="uploadForm" component="form" sx={{'& .MuiTextField-root': { m: 1, width: '50ch' },}}
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
                e.preventDefault();
                if(url.length === 0) {
                    alert("Please provide URL!");
                } else {
                    uploadImage({
                        variables: {
                            description: description,
                            url: url,
                            posterName: posterName
                        }
                    });
                    setDescription("");
                    setURL("");
                    setPosterName("");
                    alert('Image Successfully Uploaded');
                }
            }}
            >
                <div>
                    <h1 className="formTitle">Create a Post</h1>
                    <TextField
                    sx={{color: '#727272'}}
                    id="outlined-required"
                    label="Description"
                    className="formFields" 
                    autoFocus
                    value={description}
                    onChange = {(e) => {
                        setDescription(e.target.value);
                    }}
                    />
                    <br/>
                    <TextField
                    required
                    id="outlined-required"
                    label="Image URL"
                    className="formFields"
                    value={url}
                    onChange = {(e) => {
                        setURL(e.target.value);
                    }}
                    />
                    <br/>
                    <TextField
                    id="outlined-required"
                    label="Author Name"
                    className="formFields"
                    value={posterName}
                    onChange = {(e) => {
                        setPosterName(e.target.value);
                    }}
                    />
                    <br/>
                    <Button className="submitBtn" type="submit" variant="outlined">Submit</Button>
                </div>
            </Box>
        </div>
    );
};

export default UploadImage;
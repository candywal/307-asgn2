import React, { useState, useEffect } from 'react';
import Table from "./Table";
import Form from "./Form";
import axios from 'axios'; 

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter(index) {
        const character = characters[index];
        if (character && character.id) {
            axios.delete(`http://localhost:8000/users/${character.id}`)
                .then(response => {
                    if (response.status === 204) {
                        const updated = characters.filter((char, i) => i !== index);
                        setCharacters(updated);
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        console.log("User not found in the backend. Removing from frontend.");
                        const updated = characters.filter((char, i) => i !== index);
                        setCharacters(updated);
                    } else {
                        console.log("Error deleting user:", error);
                    }
                });
        }
    }

    function updateList(person) {
        makePostCall(person).then(result => {
            if (result && result.status === 201) {
                setCharacters(prevCharacters => [...prevCharacters, result.data]);
            }
        });
    }

    useEffect(() => {
        fetchAll().then(result => {
            if (result)
                setCharacters(result);
        });
    }, []);

    async function makePostCall(person) {
        try {
            const response = await axios.post('http://localhost:8000/users', person);
            return response;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    async function fetchAll() {
        try {
            const response = await axios.get('http://localhost:8000/users');
            return response.data.users_list;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    return (
        <div className="container">
            <Table characterData={characters}
                removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;

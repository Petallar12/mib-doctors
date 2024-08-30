import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Doctor.css';
import placeholderImage from '../images/default.jpg'; // This is the local placeholder image
import { FaMapMarkerAlt, FaClinicMedical, FaUserMd } from 'react-icons/fa';
import Modal from 'react-modal';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [specialitySuggestions, setSpecialitySuggestions] = useState([]);
    const [clinicNameSuggestions, setClinicNameSuggestions] = useState([]);
    const [filters, setFilters] = useState({ name: '', speciality: '', clinic_name: '' });
    const [selectedLetter, setSelectedLetter] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, selectedLetter, doctors]);

    const loadDoctors = async () => {
        try {
            const result = await axios.get('https://backend-doctor.vercel.app/doctors');
            setDoctors(result.data);
            setFilteredDoctors(result.data);
        } catch (error) {
            console.error('Failed to load doctors:', error);
        }
    };

    const applyFilters = () => {
        let updatedDoctors = doctors;

        if (filters.name) {
            updatedDoctors = updatedDoctors.filter(doctor =>
                doctor.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.speciality) {
            updatedDoctors = updatedDoctors.filter(doctor =>
                doctor.speciality.toLowerCase().includes(filters.speciality.toLowerCase())
            );
        }

        if (filters.clinic_name) {
            updatedDoctors = updatedDoctors.filter(doctor =>
                doctor.clinic_name.toLowerCase().includes(filters.clinic_name.toLowerCase())
            );
        }

        if (selectedLetter) {
            updatedDoctors = updatedDoctors.filter(doctor => {
                const nameWithoutPrefix = doctor.name.replace(/^Dr\s+/i, '');
                return nameWithoutPrefix.toLowerCase().startsWith(selectedLetter.toLowerCase());
            });
        }

        setFilteredDoctors(updatedDoctors);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });

        if (name === 'name' && value) {
            const suggestions = doctors
                .filter(doctor => doctor.name.toLowerCase().includes(value.toLowerCase()))
                .map(doctor => doctor.name.toUpperCase());
            setNameSuggestions(suggestions);
        } else if (name === 'speciality' && value) {
            const suggestions = doctors
                .filter(doctor => doctor.speciality.toLowerCase().includes(value.toLowerCase()))
                .map(doctor => doctor.speciality.toUpperCase());
            setSpecialitySuggestions(suggestions);
        } else if (name === 'clinic_name' && value) {
            const suggestions = doctors
                .filter(doctor => doctor.clinic_name.toLowerCase().includes(value.toLowerCase()))
                .map(doctor => doctor.clinic_name.toUpperCase());
            setClinicNameSuggestions(suggestions);
        } else {
            setNameSuggestions([]);
            setSpecialitySuggestions([]);
            setClinicNameSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion, type) => {
        setFilters({ ...filters, [type]: suggestion });
        setNameSuggestions([]);
        setSpecialitySuggestions([]);
        setClinicNameSuggestions([]);
    };

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        setNameSuggestions([]);
        setSpecialitySuggestions([]);
        setClinicNameSuggestions([]);
    };

    const handleImageError = (e) => {
        e.target.src = placeholderImage; // If an image fails to load, show the placeholder
    };

    const openModal = (moreInfo) => {
        setModalContent(moreInfo);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent('');
    };

    return (
        <div className="container">
            <center><h1>List of Doctors</h1></center>
            <div className="filter-box">
                <div className="filter-container">
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Doctor's Name" 
                            name="name" 
                            value={filters.name} 
                            onChange={handleFilterChange} 
                        />
                        {nameSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {nameSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, 'name')}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Type of Speciality" 
                            name="speciality" 
                            value={filters.speciality} 
                            onChange={handleFilterChange} 
                        />
                        {specialitySuggestions.length > 0 && (
                            <ul className="suggestions">
                                {specialitySuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, 'speciality')}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Clinic's Name" 
                            name="clinic_name" 
                            value={filters.clinic_name} 
                            onChange={handleFilterChange} 
                        />
                        {clinicNameSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {clinicNameSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, 'clinic_name')}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="alphabet-filter">
                    <button onClick={() => handleLetterClick('')}>All</button>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                        <button key={letter} onClick={() => handleLetterClick(letter)}>{letter}</button>
                    ))}
                </div>
            </div>

            <div className="doctor-container">
                {filteredDoctors.map(doctor => (
                    <div className="doctor-box" key={doctor.id}>
                        <div className="photo-box">
                        <img 
    src={doctor.image_url ? `${process.env.PUBLIC_URL}${doctor.image_url}` : placeholderImage} 
    alt={`${doctor.name}'s Photo`} 
    onError={handleImageError} 
/>
                        </div>
                        <h3>
                            <Link to={`/doctor/${doctor.id}`}>{doctor.name.toUpperCase()}</Link>
                        </h3>
                        <p><FaUserMd /> {doctor.speciality}</p>
                        <p><FaClinicMedical /> {doctor.clinic_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctor;

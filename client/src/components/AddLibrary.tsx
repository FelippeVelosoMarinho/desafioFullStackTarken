// src/components/AddLibrary.tsx

import React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

interface AddLibraryProps {
    isFavorite: boolean;
    onClick: () => void;
}

const AddLibrary: React.FC<AddLibraryProps> = ({ isFavorite, onClick }) => {
    return (
        <IconButton onClick={onClick} color={isFavorite ? "secondary" : "default"}>
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    );
};

export default AddLibrary;

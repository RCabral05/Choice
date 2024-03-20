// DropzoneComponent.js
import React from 'react';
import Dropzone from 'react-dropzone';
import './styles.css'; // Import the CSS file

export const DropzoneComponent = ({ onDrop }) => {
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div className="dropzone">
          <div {...getRootProps()} className="dropZone-container">
            <input {...getInputProps()} />
            <p className="dropZone-message">Drag 'n' drop an Excel file here, or click to select one</p>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

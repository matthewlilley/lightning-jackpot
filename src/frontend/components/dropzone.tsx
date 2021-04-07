import React from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'

const getColor = props => {
  if (props.isDragAccept) {
    return '#38C172'
  }
  if (props.isDragReject) {
    return '#E3342F'
  }
  if (props.isDragActive) {
    return '#FFED4A'
  }
  return '#dae1e7'
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${getColor};
  border-style: dashed;
  background-color: #f1f5f8;
  outline: none;
  transition: border 0.24s ease-in-out;
  max-width: 300px;
`

export function Dropzone({ onDrop }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: 'image/*', onDrop })
  return (
    <div>
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        <p style={{ margin: 0 }}>Click to browse, or drag image here.</p>
      </Container>
    </div>
  )
}

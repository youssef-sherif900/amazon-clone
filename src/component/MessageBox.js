import React from 'react'
import { Alert } from 'react-bootstrap'


export function MessageBox(props) {
  return (
    <Alert variant={props.variant || 'info'}>
    {props.childern}
    </Alert>
  )
}

 
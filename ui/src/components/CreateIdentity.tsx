// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Form, List, Button, Label } from 'semantic-ui-react';
import { Portfolio } from '@daml.js/create-daml-app';
import {useParty} from "@daml/react";

type Props = {
  onAddIdentity: (iky: Portfolio.IKnowYou) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const CreateIdentity: React.FC<Props> = ({onAddIdentity}) => {
  const username = useParty();
  const emptyIdentity = {
    owner: username,
    provider: "foundation",
    name: "",
    address: "",
    dateOfBirth: "1980-01-01"
  };
  const [newIdentity, setNewIdentity] = React.useState(emptyIdentity);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addIdentity = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onAddIdentity(newIdentity);
    setIsSubmitting(false);
    if (success) {
      setNewIdentity(emptyIdentity);
    }
  }

  return (
    <List relaxed>
      <Label>Submit your identification information so we know who you are:</Label>
      <br />
      <Form onSubmit={addIdentity}>
        <Form.Input
          fluid
          readOnly={isSubmitting}
          loading={isSubmitting}
          className='test-select-follow-input'
          placeholder="Name/Surname"
          value={newIdentity.name}
          onChange={(e) => setNewIdentity({...newIdentity, name: e.target.value})}
        />
        <Form.Input
            fluid
            readOnly={isSubmitting}
            loading={isSubmitting}
            className='test-select-follow-input'
            placeholder="Address"
            value={newIdentity.address}
            onChange={(e) => setNewIdentity({...newIdentity, address: e.target.value})}
        />
        <Form.Input
            fluid
            readOnly={isSubmitting}
            loading={isSubmitting}
            className='test-select-follow-input'
            placeholder="Date of Birth"
            value={newIdentity.dateOfBirth}
            onChange={(e) => setNewIdentity({...newIdentity, dateOfBirth: e.target.value})}
        />
        <Button
          type='submit'
          className='test-select-follow-button'>
          Add Identity
        </Button>
      </Form>
    </List>
  );
};

export default CreateIdentity;

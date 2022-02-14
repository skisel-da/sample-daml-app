// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import IdentityView from './IdentityView';

type Props = {
    ikys: Portfolio.IKnowYou[];
    onProvideContract: (iky: Portfolio.IKnowYou, contractNumber: string) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const IssueContractView: React.FC<Props> = ({ikys, onProvideContract}) => {
    const [contractNumber, setContractNumber] = React.useState('ABC-1234');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const provideContract = (iky: Portfolio.IKnowYou) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onProvideContract(iky, contractNumber);
        setIsSubmitting(false);
    }


    const updateContractNumber = (value: string) => {
        setContractNumber(value)
    }

    return (
        <List relaxed>
            {[...ikys].map((iky) =>
                <List.Item key={iky.owner}>
                    <List.Icon name='user outline'/>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={2}>
                                <Grid.Column>
                                    <IdentityView iky={iky}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form onSubmit={provideContract(iky)}>
                                        <Form.Input
                                            fluid
                                            readOnly={isSubmitting}
                                            loading={isSubmitting}
                                            className='test-select-follow-input'
                                            placeholder="Contract ID"
                                            value={contractNumber}
                                            onChange={(event) => updateContractNumber(event.currentTarget.value)}
                                        />
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Provide New Contract
                                        </Button>
                                    </Form>
                                </Grid.Column>
                            </Grid>
                        </Segment>
                    </List.Content>
                </List.Item>
            )}
            <br/>
        </List>
    );
};

export default IssueContractView;

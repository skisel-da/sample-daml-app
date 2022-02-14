// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {ChangeEvent, useMemo} from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import IdentityView from './IdentityView';
import {v4 as uuidv4} from 'uuid';

type Props = {
    ikysInput: Portfolio.IKnowYou[];
    onProvideContract: (iky: Portfolio.IKnowYou, contractNumber: string) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const IssueContractView: React.FC<Props> = ({ikysInput, onProvideContract}) => {
    const toFormObject = (iky: Portfolio.IKnowYou) => {
        return {
            iky: iky,
            contractNumber: "ABC-" + uuidv4().substring(0, 5)
        };
    }
    const ikys = useMemo(
        () => ikysInput
            .map(iky => toFormObject(iky))
        ,
        [ikysInput]
    );

    const [contracts, setContracts] = React.useState(ikys);
    React.useEffect(() => setContracts(ikys), [ikys]);

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const provideContract = (iky: Portfolio.IKnowYou, index: number) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        const list = [...contracts];
        await onProvideContract(iky, list[index].contractNumber);

        const newContractNumber = "ABC-" + uuidv4().substring(0, 5)
        list[index].contractNumber = newContractNumber;
        setContracts(list);

        setIsSubmitting(false);
    }

    const contractNumberValue = (i: number) => {
        return contracts[i].contractNumber;
    }

    const updateContractNumber = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const list = [...contracts];
        list[index].contractNumber = value;
        setContracts(list);
    }

    return (
        <List relaxed>
            {[...contracts].map((iky,i) =>
                <List.Item key={iky.iky.owner}>
                    <List.Icon name='user outline'/>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={2}>
                                <Grid.Column>
                                    <IdentityView iky={iky.iky}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form onSubmit={provideContract(iky.iky, i)}>
                                        <Form.Input
                                            fluid
                                            readOnly={isSubmitting}
                                            loading={isSubmitting}
                                            className='test-select-follow-input'
                                            placeholder="Contract ID"
                                            value={contractNumberValue(i)}
                                            onChange={(event) => updateContractNumber(event, i)}
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

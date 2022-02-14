// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import IdentityView from './IdentityView';

type Props = {
    ikys: Portfolio.IKnowYou[];
    onApproveIdentity: (iky: Portfolio.IKnowYou) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const IdentityCheckView: React.FC<Props> = ({ikys, onApproveIdentity}) => {
    const [, setIsSubmitting] = React.useState(false);
    const approveIdentity = (iky: Portfolio.IKnowYou) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onApproveIdentity(iky);
        setIsSubmitting(false);
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
                                    <Form onSubmit={approveIdentity(iky)}>
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Approve Identity
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

export default IdentityCheckView;

// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import ContractView from "./ContractView";

type Props = {
    offers: Portfolio.ContractOffer[];
    onApproveOffer: (iky: Portfolio.ContractOffer) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const ContractOfferApproveView: React.FC<Props> = ({offers, onApproveOffer}) => {
    const [, setIsSubmitting] = React.useState(false);
    const approveOffer = (iky: Portfolio.ContractOffer) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onApproveOffer(iky);
        setIsSubmitting(false);
    }

    return (
        <List relaxed>
            {[...offers].map((offer) =>
                <List.Item key={offer.contract.number}>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={2}>
                                <Grid.Column>
                                    <ContractView contract={offer.contract}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form onSubmit={approveOffer(offer)}>
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Sign Contract
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

export default ContractOfferApproveView;

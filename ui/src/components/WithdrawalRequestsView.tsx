// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import ContractView from "./ContractView";

type Props = {
    withdrawals: Portfolio.FullWithdrawalRequest[];
    onApproveWithdrawal: (r: Portfolio.FullWithdrawalRequest) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const WithdrawalRequestsView: React.FC<Props> = ({withdrawals, onApproveWithdrawal}) => {
    const [, setIsSubmitting] = React.useState(false);
    const approveWithdrawal = (r: Portfolio.FullWithdrawalRequest) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onApproveWithdrawal(r);
        setIsSubmitting(false);
    }

    return (
        <List relaxed>
            {[...withdrawals].map((withdrawal) =>
                <List.Item key={withdrawal.contract.number}>
                    <List.Icon name='user outline'/>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={2}>
                                <Grid.Column>
                                    <ContractView contract={withdrawal.contract}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form onSubmit={approveWithdrawal(withdrawal)}>
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Approve Withdrawal
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

export default WithdrawalRequestsView;

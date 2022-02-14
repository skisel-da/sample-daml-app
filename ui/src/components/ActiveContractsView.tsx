// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import ContractView from "./ContractView";

type Props = {
    contracts: Portfolio.Contract[];
    onDepositMoney:  (iky: Portfolio.Contract, money: string) => Promise<boolean>;
    onFullWithdrawal:  (iky: Portfolio.Contract) => Promise<boolean>;
}

const ActiveContractsView: React.FC<Props> = ({contracts, onDepositMoney, onFullWithdrawal}) => {
    const [depositAmount, setDeposit] = React.useState("0.0");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const updateContractNumber = (value: string) => {
        setDeposit(value)
    }
    const depositMoney = (contract: Portfolio.Contract) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onDepositMoney(contract, depositAmount);
        setIsSubmitting(false);
    }

    const fullWithdrawal =  (contract: Portfolio.Contract) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onFullWithdrawal(contract);
        setIsSubmitting(false);
    }

    return (
        <List relaxed>
            {[...contracts].sort((x, y) => x.number.localeCompare(y.number)).map((contract) =>
                <List.Item key={contract.number}>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={2}>
                                <Grid.Column>
                                    <ContractView contract={contract}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form onSubmit={depositMoney(contract)}>
                                        <Form.Input
                                            fluid
                                            readOnly={isSubmitting}
                                            loading={isSubmitting}
                                            className='test-select-follow-input'
                                            placeholder="Add Balance"
                                            value={depositAmount}
                                            onChange={(event) => updateContractNumber(event.currentTarget.value)}
                                        />
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Deposit
                                        </Button>
                                    </Form>
                                    <Form onSubmit={fullWithdrawal(contract)}>
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Full Withdrawal
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

export default ActiveContractsView;

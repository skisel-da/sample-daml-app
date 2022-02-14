// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {ChangeEvent, useMemo} from 'react'
import {Button, Form, Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import ContractView from "./ContractView";

type Props = {
    contracts: Portfolio.Contract[];
    onDepositMoney:  (iky: Portfolio.Contract, money: string) => Promise<boolean>;
    onFullWithdrawal:  (iky: Portfolio.Contract) => Promise<boolean>;
}

const ActiveContractsView: React.FC<Props> = ({contracts, onDepositMoney, onFullWithdrawal}) => {
    const toFormObject = (contract: Portfolio.Contract) => {
        return {
            contract: contract,
            depositAmount: "0.0"
        };
    }

    const contractObjects = useMemo(
        () => contracts
            .map(iky => toFormObject(iky))
            .sort((x, y) => x.contract.number.localeCompare(y.contract.number))
        ,
        [contracts]
    );

    const [deposits, setDeposits] = React.useState(contractObjects);
    React.useEffect(() => setDeposits(contractObjects), [contractObjects]);

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const depositMoney = (contract: Portfolio.Contract, index: number) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        const list = [...deposits];
        await onDepositMoney(contract, list[index].depositAmount);
        setIsSubmitting(false);
    }

    const fullWithdrawal = (contract: Portfolio.Contract) => async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        setIsSubmitting(true);
        await onFullWithdrawal(contract);
        setIsSubmitting(false);
    }

    const updateDeposit = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const list = [...deposits];
        list[index].depositAmount = value;
        setDeposits(list);
    }

    return (
        <List relaxed>
            {[...deposits].map((deposit, index) =>
                <List.Item key={deposit.contract.number}>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={2}>
                                <Grid.Column>
                                    <ContractView contract={deposit.contract}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form onSubmit={depositMoney(deposit.contract, index)}>
                                        <Form.Input
                                            fluid
                                            readOnly={isSubmitting}
                                            loading={isSubmitting}
                                            className='test-select-follow-input'
                                            placeholder="Add Balance"
                                            value={deposits[index].depositAmount}
                                            onChange={(event) => updateDeposit(event, index)}
                                        />
                                        <Button
                                            type='submit'
                                            className='test-select-follow-button'>
                                            Deposit
                                        </Button>
                                    </Form>
                                    <Form onSubmit={fullWithdrawal(deposit.contract)}>
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

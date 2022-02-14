// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Grid, Label, List} from 'semantic-ui-react';
import { Portfolio } from '@daml.js/create-daml-app';
import {v4 as uuidv4} from 'uuid';

type Props = {
    contract: Portfolio.Contract;
}

/**
 * React component to edit a list of `Party`s.
 */
const ContractView: React.FC<Props> = ({contract}) => {
    return (
        <Grid columns={1} doubling>
            <Grid.Column>
                Contract Owner: <Label>{contract.owner}</Label>
            </Grid.Column>
            <Grid.Column>
                Contract Number: <Label>{contract.number}</Label>
            </Grid.Column>
            <Grid.Column>
                Contract Balance: <Label>{contract.balance}</Label>
            </Grid.Column>
            <Grid.Column>
                Deposits:
                <List>
                    {[...contract.deposits].map((deposit) =>
                        <List.Item key={uuidv4()}>
                            <Grid columns={2} doubling>
                                <Grid.Column>
                                    Deposit Date: {deposit.depositDate}
                                </Grid.Column>
                                <Grid.Column>
                                    Deposit Amount: {deposit.amount}
                                </Grid.Column>
                            </Grid>
                        </List.Item>
                    )
                    }
                </List>
            </Grid.Column>
        </Grid>
    );
};

export default ContractView;

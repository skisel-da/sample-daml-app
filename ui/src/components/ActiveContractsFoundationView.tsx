// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Grid, List, Segment} from 'semantic-ui-react';
import {Portfolio} from '@daml.js/create-daml-app';
import ContractView from "./ContractView";

type Props = {
    contracts: Portfolio.Contract[];
}

const ActiveContractsFoundationView: React.FC<Props> = ({contracts}) => {
    return (
        <List relaxed>
            {[...contracts].map((contract, index) =>
                <List.Item key={contract.number}>
                    <List.Content>
                        <Segment>
                            <Grid centered columns={1}>
                                <Grid.Column>
                                    <ContractView contract={contract}/>
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

export default ActiveContractsFoundationView;

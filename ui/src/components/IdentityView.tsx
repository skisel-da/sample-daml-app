// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {Grid, Label} from 'semantic-ui-react';
import { Portfolio } from '@daml.js/create-daml-app';

type Props = {
    iky: Portfolio.IKnowYou;
}

/**
 * React component to edit a list of `Party`s.
 */
const IdentityView: React.FC<Props> = ({iky}) => {
    return (
        <Grid columns={1} doubling>
            <Grid.Column>
                Name: <Label>{iky.name}</Label>
            </Grid.Column>
            <Grid.Column>
                Address: <Label>{iky.address}</Label>
            </Grid.Column>
            <Grid.Column>
                Date Of birth: <Label>{iky.dateOfBirth}</Label>
            </Grid.Column>
        </Grid>
    );
};

export default IdentityView;

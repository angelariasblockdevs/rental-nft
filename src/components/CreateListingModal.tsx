import { ethers } from 'ethers';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState, useRef } from 'react';

import ContractAddress from "../abis/contract-address.json";
import KasuContract from "../abis/Kasu.json";
import LoginService from '../utils/LoginService';

interface Props {
    tokenID: string,
    tokenAddress: string,
    isShown: boolean,
    onShouldClose: (didListNFT: boolean) => void
}

function CreateListingModal(props: Props) {
    const [shouldDisableListButton, setShouldDisableListButton] = useState(true);
    const isValidCollateralRef = useRef(false);
    const isValidRentalDurationRef = useRef(false);
    const isValidInterestRateRef = useRef(false);
    
    const [formValues, setFormValues] = useState({
        collateralRequired: "",
        rentalDuration: "",
        interestRate: "",
    });

    const handleFormValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((formValues) => ({
            ...formValues,
            [event.target.name]: event.target.value,
        }));
    };

    const didClickListNFTButton = () => {
        const contract = new ethers.Contract(ContractAddress.Kasu, KasuContract.abi, LoginService.getInstance().signer);

        try {
            contract.listNFT(
                props.tokenID,
                props.tokenAddress,
                formValues.rentalDuration,
                formValues.interestRate,
                formValues.collateralRequired
            ).then((response: any) => {
                    // console.log("response", response);
                    setShouldDisableListButton(true);
                    props.onShouldClose(true);
                }) ;
        } catch (error: any) {
            console.log("error", error.toString());
            return;
        }
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false);
    };

    const validateCollateral = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputCollateral = parseFloat(event.target.value);
        isValidCollateralRef.current = inputCollateral >= 0.0 && inputCollateral <= 100.0;
        setShouldDisableListButton(!isValidCollateralRef.current || !isValidRentalDurationRef.current || !isValidInterestRateRef.current);
    };

    const validateRentalDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputRentalDuration = parseFloat(event.target.value);
        isValidRentalDurationRef.current = inputRentalDuration > 0.0 && inputRentalDuration <= 90.0;
        setShouldDisableListButton(!isValidCollateralRef.current || !isValidRentalDurationRef.current || !isValidInterestRateRef.current);
    };

    const validateInterestRate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputInterestRate = parseFloat(event.target.value);
        isValidInterestRateRef.current = inputInterestRate >= 0.0 && inputInterestRate <= 100.0;
        setShouldDisableListButton(!isValidCollateralRef.current || !isValidRentalDurationRef.current || !isValidInterestRateRef.current);
    };

    return (
        <Modal show={props.isShown}>
            <Modal.Dialog style={{width: '100%', marginTop: 0, marginBottom: 0}}>
                <Modal.Header>
                    <Modal.Title>List NFT for Lending</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formCollateralRequired">
                            <Form.Label>Collateral Required</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="1"
                                    name="collateralRequired"
                                    onInput={validateCollateral}
                                    onChange={handleFormValueChange}
                                    aria-label="Collateral Required"
                                    aria-describedby="basic-addon2"/>
                                <InputGroup.Text id="basic-addon2">ETH</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRentalDuration">
                            <Form.Label>Rental Duration</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="number"
                                    min="1"
                                    max="120"
                                    placeholder="1"
                                    name="rentalDuration"
                                    onInput={validateRentalDuration}
                                    onChange={handleFormValueChange}
                                    aria-label="Rental Duration"
                                    aria-describedby="basic-addon2"/>
                                <InputGroup.Text id="basic-addon2">days</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Interest Rate</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="1"
                                    name="interestRate"
                                    onInput={validateInterestRate}
                                    onChange={handleFormValueChange}
                                    aria-label="Interest Rate"
                                    aria-describedby="basic-addon2"/>
                                <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickListNFTButton} disabled={shouldDisableListButton}>List</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default CreateListingModal;

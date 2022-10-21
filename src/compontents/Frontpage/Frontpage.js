import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchTrending,
    selectStudies
} from '../../features/studies/StudiesSlice';


export default function Frontpage() {
    const studies = useSelector(selectStudies);
    const dispatch = useDispatch();


    // componentDidMount
    useEffect(() => { dispatch(fetchTrending()) }, []);

    return (
        <>
            <h1>Frontpage</h1>
            <p>{JSON.stringify(studies)}</p>
        </>
    )
}
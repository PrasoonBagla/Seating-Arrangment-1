import React from "react";
import styled from "styled-components";
import bitslogo from "../Images/bits-logo.gif"; 
import bitstagline from "../Images/bits-tagline.png"; 
import bitsline from "../Images/bits-line.gif"; 
const Bitstaglineimage = styled.img`
    wigth: 226px;
    height: 75px;
`
const Bitslogoimage = styled.img`
    wigth: 226px;
    height: 75px;
`
const Images1 = styled.div`
display: flex;
flex-direction: row;
gap: 500px;
padding-left: 250px;
padding-top: 20px;
`
const Bitslineimage = styled.img`
    width: 100%;
    height: 5px;
`
// import image from "../Images/"
const Navbar = () =>{ 
    return (
        <>
        <Images1>
        <Bitslogoimage src={bitslogo}/>
        <Bitstaglineimage src={bitstagline}/>
        </Images1>
        <Bitslineimage src={bitsline}/>
        </>
    )
}
export default Navbar;
import styled from 'styled-components'

export const PopupContainer = styled.div`
  align-items: center;
  display: flex;
  font-size: 15px;
  height: 300px;
  justify-content: center;  
  
  
  
`

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;  
  background: #ffffff;
  
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 2px;
  overflow: hidden;
  color: #000000;
  @media only screen and (max-width: 320px) {
    width: 100%;
    height: 100%;
    hr {
      margin-bottom: 0.3rem;
    }
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 360px) {
    width: 100%;
    height: 100%;
    h4 {
      font-size: small;
    }
  }
  padding-top: 5px;
`

export const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`

export const Panel = styled.div`
  width: 500px;
  height: 100;
  margin-top: 20px;
  overflow: auto;
`

export const SubheaderDiv = styled.div`
  text-transform: uppercase;
  text-align: left;
  font-size: 15px;
  margin-bottom: 10px;
`

export const ListItem = styled.div`
  text-align: left;
  font-size: 15px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  flexwrap: wrap;
`

export const Footer = styled.div`
  display: flex;
  background: #dbdbdb;
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 45px;
  color: #000000;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 9px;
`
export const FileUploaderDiv = styled.div`
  border: dashed 1px #dddddd;
  width: 350px;
  height: 60px;
  padding: 3px;
  padding-top: 19px;
  text-align: center;
  vertical-align: middle;
  line-height: 27px;
  cursor: pointer;
`

export const ButtonContainer = styled.div`
  margin: 1rem 0 2rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  bottom: 33px;
`

export const HorizontalRule = styled.hr`
  width: 90%;
  height: 0.3rem;
  border-radius: 0.8rem;
  border: none;
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  background-color: #ebd0d0;
  margin: 1.5rem 0 1rem 0;
  backdrop-filter: blur(25px);
`

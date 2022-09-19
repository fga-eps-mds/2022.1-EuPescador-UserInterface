import { fireEvent, render, screen, waitFor, } from '@testing-library/react-native'
import Login from './index'
import React, { useEffect, useState} from "react";
import { UserLogin } from '../../services/userServices/login'
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';
import Alert from "react";


describe('Login page', () => {
  it('Should render page', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    expect(screen).toBeTruthy();
  })
  it('Should check button', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const button = screen.getByText('Entrar')

    expect(button).toBeTruthy();
  })
  it('Should get placeholder', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const placeholder = screen.getByPlaceholderText('Senha')

    expect(placeholder).toBeTruthy();
  })
  it('Should get placeholder', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const placeholder = screen.getByPlaceholderText('E-mail / Telefone')

    expect(placeholder).toBeTruthy();
  })
  it('Should get placeholder', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const placeholder = screen.getByPlaceholderText('Senha')

    expect(placeholder).toBeTruthy();
  })
  it('Should get placeholder', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const placeholder = screen.getByPlaceholderText('Senha')

    expect(placeholder).toBeTruthy();
  })
  it('Should get text', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const text = screen.getByText('Não possui uma conta ainda?')

    expect(text).toBeTruthy();
  })
  it('Should get text', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const text = screen.getByText('Cadastre-se')

    expect(text).toBeTruthy();
  })
  it('Should check container', async () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const button = screen.queryByText("Entrar")

    const event = fireEvent(button, 'press');
    expect(event).toBeTruthy;
    
  }),
  it('Should EuPescador texto button', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><Login/> </ThemeProvider>      
    )
    const Eu = screen.getByText('Eu')
    const Pescador = screen.getByText('Pescador')
    expect(Eu).toBeTruthy();
    expect(Pescador).toBeTruthy();
  })

})


export { }

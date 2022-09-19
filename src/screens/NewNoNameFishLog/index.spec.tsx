import { fireEvent, render, screen, waitFor, } from '@testing-library/react-native'
import { NewNoNameFishLog} from './index'
import React, { useEffect, useState} from "react";
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';

const mockedParams = {
  route: { params: { } },
  navigation: ''
};

useNativeDriver: false

describe('Register Fish page', () => {
  it('Should render page', () => {
    const screen = render(
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    expect(screen).toBeTruthy();
  })
  it('Should check inputs', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    const inputs = screen.queryAllByLabelText("Peso (kg)")
    expect(inputs).toBeTruthy();
  })
  it('Should check inputs', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    const inputs = screen.queryAllByLabelText("Comprimento (cm)")
    expect(inputs).toBeTruthy();
  })
  it('Should check inputs', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    const button = screen.queryAllByLabelText("Nome")
    expect(button).toBeTruthy();
  })
  it('Should check text', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    const textInside = screen.queryAllByLabelText("Selecionar Foto")
    expect(textInside).toBeTruthy();
  })
  it('Should check text', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    const textInside = screen.queryAllByLabelText("Enviar")
    expect(textInside).toBeTruthy();
  })
  it('Should check text', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog {...mockedParams}/> </ThemeProvider>      
    )
    const textInside = screen.queryAllByLabelText("Tirar Foto")
    expect(textInside).toBeTruthy();
  })
  it('Should check text', () => {
    const screen = render( 
      <ThemeProvider theme={theme}><NewNoNameFishLog onPress='1' {...mockedParams}/> </ThemeProvider>      
    )
    const textInside = screen.queryAllByLabelText("Grande Grupo")
    expect(textInside).toBeTruthy();
  })

})


export { }

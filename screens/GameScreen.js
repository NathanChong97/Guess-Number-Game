import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, Button, Alert} from 'react-native';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil (min);
  max = Math.floor (max);
  const rndNum = Math.floor (Math.random () * (max - min)) + min;

  if (rndNum === exclude) {
    return generateRandomBetween (min, max, exclude);
  } else {
    return rndNum;
  }
};

const GameScreen = props => {
  const [currrentGuess, setCurrentGuess] = useState (
    generateRandomBetween (1, 100, props.userChoice)
  );

  const [rounds, setRounds] = useState(0);
  const currentLow = useRef (1);
  const currentHigh = useRef (100);

  const {userChoice, onGameOver}  = props; 

  useEffect (() => {
      if (currrentGuess === userChoice)
      {
        onGameOver(rounds);
      }
  }, [currrentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if (
      (direction === 'lower' && currrentGuess < props.userChoice) ||
      (direction === 'greater' && currrentGuess > props.userChoice)
    ) {
      Alert.alert ("Dont't lie", 'You know that this is wrong...', [
        {text: 'Sorry!', style: 'cancel'},
      ]);
      return;
    }
    if (direction === 'lower') {
      currentHigh.current = currrentGuess;
    } else {
      currentLow.current = currrentGuess;
    }

    const nextNumber = generateRandomBetween (
      currentLow.current,
      currentHigh.current,
      currrentGuess
    );
    setCurrentGuess (nextNumber);
    setRounds(curRounds => curRounds + 1);
  };

  return (
    <View style={styles.screen}>
      <Text>Opponent's Guess</Text>
      <NumberContainer>{currrentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <Button title="LOWER" onPress={nextGuessHandler.bind (this, 'lower')} />
        <Button
          title="GREATER"
          onPress={nextGuessHandler.bind (this, 'greater')}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create ({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 300,
    maxWidth: '80%',
  },
});

export default GameScreen;

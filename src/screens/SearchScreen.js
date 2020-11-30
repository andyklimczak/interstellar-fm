import React from 'react';
import { Text, View } from 'react-native';
import { observer } from "mobx-react";

const SearchScreen = observer((props) => {
      return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search!</Text>
    </View>
  );
})

export default SearchScreen
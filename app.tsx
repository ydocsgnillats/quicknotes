/* -QuickNotes App- 
   React-Native app with a PostgreSQL database and Hasura GraphQL endpoint.
   View, Store, Change, & Delete your notes quickly
*/

import React, { Component, useState, setState } from 'react';
import { StyleSheet, ScrollView, FlatList, SafeAreaView, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

/* stylesheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#adbfac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 35,
    margin: 15,
  },
  text: {
    color: 'black',
    padding: 10,
    fontSize: 14
  },
  button: {
    borderWidth: 2,
    borderColor:'green',
    backgroundColor:'#adbfac',
    margin: 5
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor:'green',
    backgroundColor: '#e8f2e4',
    height: 150,
    width: '99%',
    padding: 10
  },
  scroll: {
    backgroundColor: '#e8f2e4',
    color: 'black',
    height: 600,
    width: '99%'
  },
  note: {
    borderColor:'green',
    borderWidth: 1,
    backgroundColor: '#e8f2e4',
    margin: 5,
    padding: 5
  }
});

function App(){
    
    const [note, setNote] = useState("");
    const [newNote, setNewNote] = useState("");
    const [data, setdata] = useState("");     
    const GRAPHQL_ENDPOINT = "https://quicknotess.herokuapp.com/v1/graphql";

/* DB Query Strings*/
    const fetchDoc = `
      query fetchNotes {
        notes {
          id
          note
        }
      }
    `;

    const sendDoc = `
    mutation sendNotes($note:String!) {
      insert_notes_one(object: {note: $note}) {
        note
      }
    }
    `;

    const changeDoc = `
    mutation changeNotes($note:String!) {
      update_notes(where: {note: {_eq: $note}}, _set: {note: "changed}) {
        returning {
          note
        }
      }
    }
    `;

    const deleteDoc = `
    mutation deleteNotes($note: String!) {
      delete_notes(where: {note: {_eq: $note}}) {
        returning {
          note
        }
      }
    }
    `;

/* DB Query Functions */
    function fetchQuery() {
      return fetchGraphQL(
        fetchDoc,
        "fetchNotes",
        {}
      );
    }

    function sendQuery() {
      return fetchGraphQL(
        sendDoc,
        "sendNotes",
        {}
      );
    }

    function changeQuery() {
      return fetchGraphQL(
        changeDoc,
        "changeNotes",
        {}
      );
    }

    function deleteQuery() {
      return fetchGraphQL(
        deleteDoc,
        "deleteNotes",
        {}
      );
    }

/* Functions + error handling */
    async function fetchNotes() {
      const { errors, data } = await fetchQuery();
      if (errors) {
        console.error(errors);
      }
      return (data);
    }

    async function sendNotes() {
      const { errors, data } = await sendQuery();
      if (errors) {
        console.error(errors);
      }
      console.log(data);
    }

    async function changeNotes() {
      const { errors, data } = await changeQuery();
      if (errors) {
        console.error(errors);
      }
      console.log(data);
    }

    async function deleteNotes() {
      const { errors, data } = await deleteQuery();
      if (errors) {
        console.error(errors);
      }
      console.log(data);
    }

    async function fetchGraphQL(fetchDoc, operationName, variables) {
      const result = await fetch(
        GRAPHQL_ENDPOINT,
        {
          method: "POST",
          body: JSON.stringify({
            query: fetchDoc,
            variables: {note},
            operationName: operationName
          })
        }
      );
      setState({ data: result });
      return await result.json();
    }
    
    function renderItems() {
      const items = [];
      for (var dataItem in data){
        items.push( <Text>{ dataItem }</Text> );
      }
      return items;
    }
    
/* App structure */
    return (
    <View style={styles.container}>
        <Text style={styles.title}>-QuickNotes-</Text>
        <TextInput style={styles.input} onChangeText={(text) => setNote(text)} placeholder =  'Enter note: '/> 
        <TouchableOpacity
            style = {styles.button}
            onPress = {() => sendNotes()}>
            <Text style={styles.text}> Send it. </Text>
        </TouchableOpacity>
        <ScrollView  style={styles.scroll} contentContainerStyle={styles.scroll}>
            {renderItems()}
        </ScrollView>
        <TouchableOpacity
            style = {styles.button}
            onPress = {() => changeNotes()}>
            <Text style={styles.text}> Change it. </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style = {styles.button}
            onPress = {() => deleteNotes()}>
            <Text style={styles.text}> Delete it. </Text>
      </TouchableOpacity>
      </View>
  );
}

export default App;

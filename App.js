import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

import { MailComposer, DocumentPicker, FileSystem }   from 'expo';



const loading = async(filename) => {
  const picked = await DocumentPicker.getDocumentAsync();
  if (picked.type === 'cancel') {
    alert( 'Picking cancelled' );
    return null;
  }
  else {
    const doc = await FileSystem.readAsStringAsync(
        picked.uri,
        { encoding: FileSystem.EncodingTypes.Base64, }
    );
    const localURI = `${ FileSystem.cacheDirectory }${ filename }`;
    await FileSystem.writeAsStringAsync(
        localURI,
        doc,
        { encoding: FileSystem.EncodingTypes.Base64, }
    );
    return FileSystem.getInfoAsync(localURI);
  }
};

const mailing = async (uri) => {
  if(!!uri)
    return MailComposer.composeAsync({
      recipients: [ 'friends@gmail.com' ],
      subject: 'Test',
      body: 'This is a test with attachment.',
      attachments: [ uri ],
    });
  else
    return MailComposer.composeAsync({
      recipients: [ 'friends@gmail.com' ],
      subject: 'Test',
      body: 'This is a test without attachment.',
    })
};

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileExists: false,
      fileURI: ''
    }
  }

  _handlePressLoad = (filename) => {
    loading(filename).then( resp => {
      console.log(resp); this.setState({ fileExists: resp.exists === 1, fileURI: resp.uri }); alert('File picked');
    }).catch( err => console.log(err));
  };

  _handlePressMail = () => {
      mailing().then( resp => console.log(resp)).catch( err => console.log(err));
  };

  _handlePressMailWith = () => {
    if (this.state.fileExists)
      mailing(this.state.fileURI).then( resp => console.log(resp)).catch( err => console.log(err));
    else
      alert('File does not exist')
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
            title='Click to load file and name it with extension .doc'
            onPress={ () => this._handlePressLoad('testFile.doc') }
        />
        <Button
            title='Click to load file and name it without extension'
            onPress={ () => this._handlePressLoad('testFile') }
        />
        <Button
            title='Click me to send a mail without attachment'
            onPress={ this._handlePressMail }
        />
        <Button
            title='Click me to send a mail with attachment'
            onPress={ this._handlePressMailWith }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

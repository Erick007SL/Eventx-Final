import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        
    },
    botoes: {
        width: 100,
    },
    containerMask:{
        flexDirection: 'row',
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
    },  
    maskedInput: {
        flexGrow: 1,
        height: 40,
        fontSize: 18,
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        alignSelf: 'flex-start',

    },
    errorMessage: {
        alignSelf:'flex-start',
        marginLeft: 15,
        color: '#f00',
        fontSize: 12,

    }
});


export default styles;
import React, { useState } from 'react';
import { Button, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const App = () => {
  const [task, setTask] = useState(''); // Current input text
  const [tasks, setTasks] = useState<any>([]); // List of tasks

  // Function to send telemetry data
  const sendTelemetry = async (eventType:any, message:any) => {
    try {
      const response = await fetch('http://10.0.2.2:4000/send-telemetry', { // API Endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, message }), // Event Type and Message
      });
      const data = await response.json();
      console.log('Telemetry Response:', data);
    } catch (error) {
      console.error('Error sending telemetry:', error);
    }
  };

  // Add Task
  const handleAddTask = () => {
    if (task.trim() === '') return;

    const newTask = { id: Date.now().toString(), name: task };
    setTasks([...tasks, newTask]);
    setTask(''); // Clear input

    // Send telemetry for Add Button Click and List Update
    sendTelemetry('add_button_click', 'Add button clicked: Task Added');
    sendTelemetry('list_update', 'List Updated: New task added');
  };

  // Delete Task
  const handleDeleteTask = (id:any) => {
    const updatedTasks = tasks.filter((item:any) => item.id !== id);
    setTasks(updatedTasks);

    // Send telemetry for Delete Button Click and List Update
    sendTelemetry('delete_button_click', 'Delete button clicked: Task Deleted');
    sendTelemetry('list_update', 'List Updated: Task removed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do App with Telemetry</Text>

      {/* Input Field and Add Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <Button title="Add Task" onPress={handleAddTask} />
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item:any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding: 8,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
  },
});

export default App;

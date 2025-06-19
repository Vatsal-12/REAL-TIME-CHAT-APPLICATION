import React, { useEffect, useState, useRef } from 'react';

const socket = new WebSocket('ws://localhost:8080');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.onmessage = async (event) => {
      const data = event.data;
      const text = data instanceof Blob ? await data.text() : data;
      setMessages((prev) => [...prev, { text, type: 'received' }]);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.send(input);
      setMessages((prev) => [...prev, { text: input, type: 'sent' }]);
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Real Time Chat</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.type === 'sent' ? styles.sent : styles.received}>
            <span style={styles.bubble}>{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  chatBox: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: 10,
    height: 400,
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  sent: {
    textAlign: 'right',
    margin: '10px 0',
  },
  received: {
    textAlign: 'left',
    margin: '10px 0',
  },
  bubble: {
    display: 'inline-block',
    padding: '10px 15px',
    borderRadius: 20,
    maxWidth: '70%',
    wordWrap: 'break-word',
    backgroundColor: '#e0f7fa',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    marginTop: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  button: {
    padding: '10px 20px',
    borderRadius: 6,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
  },
};

export default App;

import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [components, setComponents] = useState([
    { name: 'Resistor', quantity: 10 },
    { name: 'LED', quantity: 15 }
  ]);

  const [editing, setEditing] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({});
  const [newComponent, setNewComponent] = useState({ name: '', quantity: '' });

  const [studentInfo, setStudentInfo] = useState({
    name: '',
    prn: '',
    year: ''
  });

  const [purchaseDate, setPurchaseDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Admin Section State
  const [adminData, setAdminData] = useState([]);

  // Search Query State
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (index) => {
    setEditing(index);
  };

  const handleSave = (index) => {
    setEditing(null);
  };

  const handleBuy = (component) => {
    setOverlayData(component);
    setShowOverlay(true);
  };

  const handleOverlaySubmit = (e) => {
    e.preventDefault();

    // Parse quantity as an integer to avoid concatenation issues
    const purchaseQuantity = parseInt(overlayData.quantity);

    // Check if the quantity requested is more than available
    const availableQuantity = components.find(
      (comp) => comp.name === overlayData.name
    ).quantity;

    if (purchaseQuantity > availableQuantity) {
      window.alert('Out of stock!');
      return;
    }

    // Update component quantity
    const updatedComponents = components.map((comp) =>
      comp.name === overlayData.name
        ? { ...comp, quantity: comp.quantity - purchaseQuantity }
        : comp
    );

    setComponents(updatedComponents);

    // Store the transaction details in admin section
    setAdminData([
      ...adminData,
      {
        student: studentInfo,
        component: overlayData.name,
        quantity: purchaseQuantity, // Store only the purchase quantity
        purchaseDate,
        returnDate
      }
    ]);

    // Reset form fields and close overlay
    setShowOverlay(false);
    setStudentInfo({ name: '', prn: '', year: '' });
    setPurchaseDate('');
    setReturnDate('');
  };

  const handleAddComponent = () => {
    setComponents([...components, { name: newComponent.name, quantity: parseInt(newComponent.quantity) }]);
    setNewComponent({ name: '', quantity: '' });
  };

  const handleDelete = (index) => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);
  };

  // Close Overlay Form
  const closeOverlay = () => {
    setShowOverlay(false);
    setStudentInfo({ name: '', prn: '', year: '' });
    setPurchaseDate('');
    setReturnDate('');
  };

  // Handle Return of Components
  const handleReturn = (index, componentName, returnQuantity) => {
    // Parse returnQuantity to ensure it is treated as a number, not a string
    const returnQty = parseInt(returnQuantity);

    // Restore the original quantity in the components list
    const updatedComponents = components.map((comp) =>
      comp.name === componentName
        ? { ...comp, quantity: comp.quantity + returnQty }
        : comp
    );
    setComponents(updatedComponents);

    // Remove the entry from the admin section
    const updatedAdminData = adminData.filter((_, i) => i !== index);
    setAdminData(updatedAdminData);

    // Display confirmation message
    alert('Component returned successfully!');
  };

  // Search Functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filtered Components based on search query
  const filteredComponents = components.filter((component) =>
    component.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <input
          type="text"
          className="search-bar"
          placeholder="Search component by name..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="dashboard-button">Admin Section</button>
        <button className="dashboard-button">Log Out</button>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Component Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComponents.map((component, index) => (
            <tr key={index}>
              <td>
                {editing === index ? (
                  <input
                    type="text"
                    value={component.name}
                    onChange={(e) => {
                      const newComponents = [...components];
                      newComponents[index].name = e.target.value;
                      setComponents(newComponents);
                    }}
                  />
                ) : (
                  component.name
                )}
              </td>
              <td>
                {editing === index ? (
                  <input
                    type="number"
                    value={component.quantity}
                    onChange={(e) => {
                      const newComponents = [...components];
                      newComponents[index].quantity = e.target.value;
                      setComponents(newComponents);
                    }}
                  />
                ) : (
                  component.quantity
                )}
              </td>
              <td>
                {editing === index ? (
                  <button onClick={() => handleSave(index)} className="dashboard-button">
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(index)} className="dashboard-button">
                    Edit
                  </button>
                )}
                <button onClick={() => handleBuy(component)} className="dashboard-button">
                  Buy
                </button>
                <button onClick={() => handleDelete(index)} className="dashboard-button delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-component-container">
        <input
          type="text"
          placeholder="Component Name"
          value={newComponent.name}
          onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newComponent.quantity}
          onChange={(e) => setNewComponent({ ...newComponent, quantity: e.target.value })}
        />
        <button onClick={handleAddComponent} className="dashboard-button">
          Add Component
        </button>
      </div>

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Purchase Component</h2>
            <form onSubmit={handleOverlaySubmit}>
              <div>
                <label>Student Name: </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>PRN: </label>
                <input
                  type="text"
                  value={studentInfo.prn}
                  onChange={(e) => setStudentInfo({ ...studentInfo, prn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Year: </label>
                <input
                  type="text"
                  value={studentInfo.year}
                  onChange={(e) => setStudentInfo({ ...studentInfo, year: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Component Name: </label>
                <input type="text" value={overlayData.name} readOnly />
              </div>
              <div>
                <label>Quantity: </label>
                <input
                  type="number"
                  value={overlayData.quantity}
                  onChange={(e) => setOverlayData({ ...overlayData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Purchase Date: </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Return Date: </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="dashboard-button">Submit</button>
              <button type="button" className="dashboard-button" onClick={closeOverlay}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Section */}
      {adminData.length > 0 && (
        <div className="admin-section">
          <h2>Admin Section</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>PRN</th>
                <th>Year</th>
                <th>Component</th>
                <th>Quantity</th>
                <th>Purchase Date</th>
                <th>Return Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.student.name}</td>
                  <td>{entry.student.prn}</td>
                  <td>{entry.student.year}</td>
                  <td>{entry.component}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.purchaseDate}</td>
                  <td>{entry.returnDate}</td>
                  <td>
                    <button onClick={() => handleReturn(index, entry.component, entry.quantity)} className="dashboard-button">
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

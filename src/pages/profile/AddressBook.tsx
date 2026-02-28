// src/pages/profile/AddressBook.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { User, Trash2, Plus, MessageSquare, MapPin, Save, X } from "lucide-react";

export default function AddressBook() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([
    { id: 1, name: "Mary Banda", phone: "+265 888 456 789", location: "Kasungu", type: "farmer", notes: "Reliable tomato supplier" },
    { id: 2, name: "Zomba Fresh Produce", phone: "+265 999 321 654", location: "Zomba", type: "buyer", notes: "Bulk buyer for maize" },
  ]);

  const [newContact, setNewContact] = useState({ name: "", phone: "", location: "", type: "farmer", notes: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddOrUpdate = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;

    if (editingId !== null) {
      setContacts(prev =>
        prev.map(c => (c.id === editingId ? { ...c, ...newContact } : c))
      );
      setEditingId(null);
    } else {
      setContacts(prev => [...prev, { id: Date.now(), ...newContact }]);
    }

    setNewContact({ name: "", phone: "", location: "", type: "farmer", notes: "" });
    setShowAddForm(false);
  };

  const handleEdit = (contact: typeof contacts[0]) => {
    setNewContact(contact);
    setEditingId(contact.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Remove this contact?")) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Address Book</h1>
          <Button
            onClick={() => {
              setNewContact({ name: "", phone: "", location: "", type: "farmer", notes: "" });
              setEditingId(null);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> {showAddForm ? "Cancel" : "Add Contact"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Contact" : "Add New Contact"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  value={newContact.name}
                  onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Full name or business"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  value={newContact.phone}
                  onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="+265 999 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  value={newContact.location}
                  onChange={e => setNewContact({ ...newContact, location: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="City, Region"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newContact.type}
                  onChange={e => setNewContact({ ...newContact, type: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="farmer">Farmer / Supplier</option>
                  <option value="buyer">Buyer / Business</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={newContact.notes}
                  onChange={e => setNewContact({ ...newContact, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Delivery preferences, payment terms, etc..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOrUpdate}>
                <Save size={16} className="mr-2" />
                {editingId ? "Update Contact" : "Save Contact"}
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {contacts.length === 0 ? (
            <Card className="p-12 text-center">
              <User className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="text-2xl font-semibold mb-3">No saved contacts yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Save sellers or buyers from marketplace or messages
              </p>
              <Button onClick={() => setShowAddForm(true)}>Add Your First Contact</Button>
            </Card>
          ) : (
            contacts.map(contact => (
              <Card key={contact.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User size={24} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <MapPin size={14} /> {contact.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {contact.type === "farmer" ? "Supplier" : "Buyer"} • {contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                      <MessageSquare size={14} /> Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
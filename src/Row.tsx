import { useState } from "react";

export function ConditionBuilder() {
  // Initialize state with one default empty condition.
  const [conditions, setConditions] = useState([
    { id: crypto.randomUUID(), field: "name", operator: "equals", value: "" },
  ]);

  // Define the available options for the dropdowns.
  const fields = ["name", "age", "status", "email"];
  const operators = ["equals", "contains", "greater_than", "less_than"];

  // Update a specific property of a specific condition row.
  const updateCondition = (id: string, key: string, newValue: string): void => {
    setConditions((prevConditions) =>
      prevConditions.map((condition) =>
        condition.id === id ? { ...condition, [key]: newValue } : condition,
      ),
    );
  };

  // Append a new default condition row to the list.
  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: crypto.randomUUID(), field: "name", operator: "equals", value: "" },
    ]);
  };

  // Remove a condition row by its unique identifier.
  const removeCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  return (
    <div
      style={{ padding: "20px", maxWidth: "600px", fontFamily: "sans-serif" }}
    >
      <h3>Condition Builder</h3>

      {conditions.map((condition, index) => (
        <div
          key={condition.id}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          {/* Render the AND label for rows after the first one. */}
          <span style={{ width: "40px", fontWeight: "bold" }}>
            {index > 0 ? "AND" : ""}
          </span>

          <select
            value={condition.field}
            onChange={(e) =>
              updateCondition(condition.id, "field", e.target.value)
            }
            style={{ padding: "5px" }}
          >
            {fields.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={condition.operator}
            onChange={(e) =>
              updateCondition(condition.id, "operator", e.target.value)
            }
            style={{ padding: "5px" }}
          >
            {operators.map((op) => (
              <option key={op} value={op}>
                {op.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={condition.value}
            onChange={(e) =>
              updateCondition(condition.id, "value", e.target.value)
            }
            placeholder="Value..."
            style={{ padding: "5px", flex: 1 }}
          />

          <button
            onClick={() => removeCondition(condition.id)}
            disabled={conditions.length === 1}
            style={{
              padding: "5px 10px",
              cursor: conditions.length === 1 ? "not-allowed" : "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addCondition}
        style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
      >
        + Add Condition
      </button>

      {/* Output the resulting data structure for debugging. */}
      <div
        style={{
          marginTop: "30px",
          padding: "10px",
          backgroundColor: "#f4f4f4",
        }}
      >
        <h4>Output:</h4>
        <pre>{JSON.stringify(conditions, null, 2)}</pre>
      </div>
    </div>
  );
}

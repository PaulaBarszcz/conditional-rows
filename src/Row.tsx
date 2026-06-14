import { useReducer } from "react";

// --- Types ---

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

type Action =
  | { type: "ADD" }
  | {
      type: "UPDATE";
      id: string;
      key: keyof Omit<Condition, "id">;
      newValue: string;
    }
  | { type: "REMOVE"; id: string };

// --- Reducer ---

function conditionsReducer(state: Condition[], action: Action): Condition[] {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          field: "name",
          operator: "equals",
          value: "",
        },
      ];
    case "UPDATE":
      return state.map((c) =>
        c.id === action.id ? { ...c, [action.key]: action.newValue } : c,
      );
    case "REMOVE":
      return state.filter((c) => c.id !== action.id);
  }
}

// --- Generic ConditionRow component ---

interface ConditionRowProps<TField extends string, TOperator extends string> {
  condition: Condition;
  fields: readonly TField[];
  operators: readonly TOperator[];
  isOnly: boolean;
  isFirst: boolean;
  onUpdate: (
    id: string,
    key: keyof Omit<Condition, "id">,
    newValue: string,
  ) => void;
  onRemove: (id: string) => void;
}

function ConditionRow<TField extends string, TOperator extends string>({
  condition,
  fields,
  operators,
  isOnly,
  isFirst,
  onUpdate,
  onRemove,
}: ConditionRowProps<TField, TOperator>) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "10px",
        alignItems: "center",
      }}
    >
      <span style={{ width: "40px", fontWeight: "bold" }}>
        {isFirst ? "" : "AND"}
      </span>

      <select
        value={condition.field}
        onChange={(e) => onUpdate(condition.id, "field", e.target.value)}
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
        onChange={(e) => onUpdate(condition.id, "operator", e.target.value)}
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
        onChange={(e) => onUpdate(condition.id, "value", e.target.value)}
        placeholder="Value..."
        style={{ padding: "5px", flex: 1 }}
      />

      <button
        onClick={() => onRemove(condition.id)}
        disabled={isOnly}
        style={{
          padding: "5px 10px",
          cursor: isOnly ? "not-allowed" : "pointer",
        }}
      >
        Remove
      </button>
    </div>
  );
}

// --- Main component ---

const FIELDS = ["name", "age", "status", "email"] as const;
const OPERATORS = ["equals", "contains", "greater_than", "less_than"] as const;

const initialState: Condition[] = [
  { id: crypto.randomUUID(), field: "name", operator: "equals", value: "" },
];

export function ConditionBuilder() {
  const [conditions, dispatch] = useReducer(conditionsReducer, initialState);

  const handleUpdate = (
    id: string,
    key: keyof Omit<Condition, "id">,
    newValue: string,
  ) => dispatch({ type: "UPDATE", id, key, newValue });

  const handleRemove = (id: string) => dispatch({ type: "REMOVE", id });

  return (
    <div
      style={{ padding: "20px", maxWidth: "600px", fontFamily: "sans-serif" }}
    >
      <h3>Condition Builder</h3>

      {conditions.map((condition, index) => (
        <ConditionRow
          key={condition.id}
          condition={condition}
          fields={FIELDS}
          operators={OPERATORS}
          isOnly={conditions.length === 1}
          isFirst={index === 0}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
        />
      ))}

      <button
        onClick={() => dispatch({ type: "ADD" })}
        style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
      >
        + Add Condition
      </button>

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

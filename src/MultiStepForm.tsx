type Step = 1 | 2 | 3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface State {
  step: Step;
  data: FormData;
}

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "UPDATE"; field: keyof FormData; value: string }
  | { type: "RESET" };

const initialState: State = {
  step: 1,
  data: { firstName: "", lastName: "", email: "", password: "" },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: (state.step + 1) as Step };
    case "BACK":
      return { ...state, step: (state.step - 1) as Step };
    case "UPDATE":
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
      };
    case "RESET":
      return initialState;
  }
}

import { useReducer } from "react";

export function MultiStepForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, data } = state;

  return (
    <div
      style={{ maxWidth: 400, paddingBottom: "40px", fontFamily: "sans-serif" }}
    >
      <p>Krok {step} z 3</p>

      {step === 1 && (
        <div>
          <h2>Dane osobowe</h2>
          <label>
            Imię
            <input
              value={data.firstName}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE",
                  field: "firstName",
                  value: e.target.value,
                })
              }
            />
          </label>
          <label>
            Nazwisko
            <input
              value={data.lastName}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE",
                  field: "lastName",
                  value: e.target.value,
                })
              }
            />
          </label>
          <button
            onClick={() => dispatch({ type: "NEXT" })}
            disabled={!data.firstName || !data.lastName}
          >
            Dalej →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Konto</h2>
          <label>
            Email
            <input
              type="email"
              value={data.email}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE",
                  field: "email",
                  value: e.target.value,
                })
              }
            />
          </label>
          <label>
            Hasło
            <input
              type="password"
              value={data.password}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE",
                  field: "password",
                  value: e.target.value,
                })
              }
            />
          </label>
          <button onClick={() => dispatch({ type: "BACK" })}>← Wróć</button>
          <button
            onClick={() => dispatch({ type: "NEXT" })}
            disabled={!data.email || !data.password}
          >
            Dalej →
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Podsumowanie</h2>
          <p>
            Imię: {data.firstName} {data.lastName}
          </p>
          <p>Email: {data.email}</p>
          <button onClick={() => dispatch({ type: "BACK" })}>← Wróć</button>
          <button onClick={() => dispatch({ type: "RESET" })}>
            Wyślij i resetuj
          </button>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Smart Healthcare System</h1>
      <nav>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}

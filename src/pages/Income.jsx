import { useEffect, useState } from "react";
import api from "../services/api.js";
import TransactionTable from "../components/TransactionTable.jsx";
import { toast } from "react-toastify";

const Income = () => {
  // Initial form
  const initial = {
    title: "",
    amount: "",
    category: "Salary",
    date: new Date().toISOString().split("T")[0],
    description: ""
  };

  // States
  const [form, setForm] = useState(initial);
  const [incomes, setIncomes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =====================================================
  // GET ALL INCOME
  // =====================================================

  const load = async () => {
    try {
      const response = await api.get("/income");

      setIncomes(response.data);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to load income records"
      );
    }
  };

  // Load records when page opens
  useEffect(() => {
    load();
  }, []);

  // =====================================================
  // ADD / UPDATE INCOME
  // =====================================================

  const submit = async (e) => {
    e.preventDefault();

    // Prevent double click
    if (loading) return;

    setLoading(true);

    try {

      // UPDATE
      if (editingId) {

        await api.put(
          `/income/${editingId}`,
          form
        );

        toast.success(
          "Income updated successfully!"
        );

      }

      // ADD
      else {

        await api.post(
          "/income",
          form
        );

        toast.success(
          "Income added successfully!"
        );

      }

      // Reset form
      setForm(initial);

      // Remove edit mode
      setEditingId(null);

      // Refresh records
      await load();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE INCOME
  // =====================================================

  const remove = async (id) => {

    // Confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this income?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeleteLoading(true);

    try {

      await api.delete(
        `/income/${id}`
      );

      toast.success(
        "Income deleted successfully!"
      );

      // Refresh records
      await load();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Delete failed"
      );

    } finally {

      setDeleteLoading(false);

    }
  };

  // =====================================================
  // EDIT INCOME
  // =====================================================

  const edit = (item) => {

    setEditingId(item._id);

    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: new Date(item.date)
        .toISOString()
        .split("T")[0],
      description: item.description || ""
    });

    toast.info(
      "Income loaded for editing"
    );

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setEditingId(null);

    setForm(initial);

    toast.info(
      "Edit cancelled"
    );
  };

  // =====================================================
  // RETURN UI
  // =====================================================

  return (
    <div className="container-fluid px-0">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>

          <div className="d-flex align-items-center gap-2 mb-1">

            <div
              className="rounded-circle bg-success bg-opacity-10 text-success d-flex justify-content-center align-items-center"
              style={{
                width: "42px",
                height: "42px"
              }}
            >
              <i
                className="bi bi-arrow-down-left"
                style={{ fontSize: "20px" }}
              ></i>
            </div>

            <div>

              <h1 className="fw-bold mb-0">
                Income Management
              </h1>

              <p className="text-muted mb-0">
                Add and manage all your income records.
              </p>

            </div>

          </div>

        </div>

        {/* Records Count */}

        <div className="mt-3 mt-md-0">

          <span className="badge bg-white text-dark border px-3 py-2 shadow-sm">

            <i className="bi bi-wallet2 me-2 text-success"></i>

            {incomes.length} Records

          </span>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        {/* Card Header */}

        <div className="card-header bg-white border-0 pt-4 px-4">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="fw-bold mb-1">

                <i
                  className={
                    editingId
                      ? "bi bi-pencil-square text-primary me-2"
                      : "bi bi-plus-circle text-success me-2"
                  }
                ></i>

                {editingId
                  ? "Edit Income"
                  : "Add New Income"}

              </h5>

              <small className="text-muted">

                {editingId
                  ? "Update your income information below."
                  : "Enter the details of your new income."}

              </small>

            </div>

            <div
              className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: "45px",
                height: "45px"
              }}
            >
              <i
                className="bi bi-cash-stack"
                style={{ fontSize: "21px" }}
              ></i>
            </div>

          </div>

        </div>

        {/* Form */}

        <div className="card-body p-4">

          <form onSubmit={submit}>

            <div className="row g-4">

              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Income Title

                  <span className="text-danger ms-1">
                    *
                  </span>

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">

                    <i className="bi bi-pencil text-muted"></i>

                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Monthly Salary"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  AMOUNT
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Amount

                  <span className="text-danger ms-1">
                    *
                  </span>

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white fw-semibold">

                    Rs.

                  </span>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Category

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">

                    <i className="bi bi-tag text-muted"></i>

                  </span>

                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value
                      })
                    }
                  >

                    <option value="Salary">
                      Salary
                    </option>

                    <option value="Freelancing">
                      Freelancing
                    </option>

                    <option value="Business">
                      Business
                    </option>

                    <option value="Investment">
                      Investment
                    </option>

                    <option value="Gift">
                      Gift
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              {/* =================================================
                  DATE
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Date

                  <span className="text-danger ms-1">
                    *
                  </span>

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">

                    <i className="bi bi-calendar3 text-muted"></i>

                  </span>

                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="col-12">

                <label className="form-label fw-semibold">

                  Description

                  <span className="text-muted fw-normal ms-1">
                    (Optional)
                  </span>

                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter a short description about this income..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }
                ></textarea>

              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="col-12 d-flex flex-wrap gap-2">

                {/* ADD / UPDATE */}

                <button
                  type="submit"
                  className={
                    editingId
                      ? "btn btn-primary px-4"
                      : "btn btn-success px-4"
                  }
                  disabled={loading}
                >

                  {loading ? (

                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      {editingId
                        ? "Updating..."
                        : "Adding..."}

                    </>

                  ) : (

                    <>
                      <i
                        className={
                          editingId
                            ? "bi bi-check2-circle me-2"
                            : "bi bi-plus-circle me-2"
                        }
                      ></i>

                      {editingId
                        ? "Update Income"
                        : "Add Income"}

                    </>

                  )}

                </button>

                {/* CANCEL */}

                {editingId && (

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={cancelEdit}
                    disabled={loading}
                  >

                    <i className="bi bi-x-circle me-2"></i>

                    Cancel

                  </button>

                )}

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* =================================================
          INCOME RECORDS
      ================================================= */}

      <div className="card border-0 shadow-sm rounded-4">

        {/* Header */}

        <div className="card-header bg-white border-0 p-4">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

            <div>

              <h5 className="fw-bold mb-1">

                <i className="bi bi-list-ul text-primary me-2"></i>

                Income Records

              </h5>

              <small className="text-muted">

                All your recorded income transactions.

              </small>

            </div>

            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">

              Total: Rs.{" "}

              {incomes
                .reduce(
                  (total, item) =>
                    total + Number(item.amount),
                  0
                )
                .toLocaleString()}

            </span>

          </div>

        </div>

        {/* Table */}

        <div className="card-body pt-0 px-4 pb-4">

          <TransactionTable
            transactions={incomes}
            type="income"
            onEdit={edit}
            onDelete={remove}
          />

        </div>

      </div>

    </div>
  );
};

export default Income;
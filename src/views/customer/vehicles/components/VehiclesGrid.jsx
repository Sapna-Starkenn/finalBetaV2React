import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import { GiMineTruck } from "react-icons/gi";
import { TabPanel, TabView } from "primereact/tabview";
import FeatureSet from "./FeatureSet";
import VehicleTrips from "./VehicleTrips";
import { FilterMatchMode } from "primereact/api";

const applyFilters = (filters, allData) => {
  let filteredData = allData;

  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "vehicle_id" &&
          key !== "user_uuid" &&
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
      )
    );
  }

  return filteredData;
};

export default function VehiclesGrid({
  vehiData,
  editvehicle,
  deleteVehicle,
  ecuData,
  iotData,
  dmsData,
  feauresetData,
}) {
  const token = Cookies.get("token");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteVehicleName, setDeleteVehicleName] = useState("");
  const [myData, setMyData] = useState();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [devices, setDevices] = useState({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const totalItems = filteredData.length;

  useEffect(() => {
    setAllData(vehiData);
    const filteredData = applyFilters(filters, vehiData);
    setFilteredData(filteredData);
  }, [vehiData, filters]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    const updatedFilters = {
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const updatedFilters = {
      ...filters,
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  const openEditDialog = (rowData) => {
    setEditDialog(true);
    setEditData(rowData);

    setEditId(rowData?.vehicle_uuid);
  };

  const closeEditDialog = () => {
    setEditDialog(false);
    setEditData({});
    setEditId("");
    setDevices({});
  };

  const DeleteDialog = (item) => {
    setDeleteDialog(!deleteDialog);
    setDeleteId(item?.vehicle_uuid);
    setDeleteVehicleName(item?.vehicle_name);
  };

  const handleDelete = () => {
    if (deleteId !== "") {
      deleteVehicle(deleteId, token);
      DeleteDialog();
    }
  };

  const ViewDialog = (rowData) => {
    setMyData(rowData);
    setViewDialog(true);
  };
  const closeViewDialog = () => {
    setViewDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  //onSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId && editData) {
      editvehicle(editId, editData);
      closeEditDialog();
    }
  };

  //dropdown options

  const featuresetOptions = () => {
    return feauresetData?.map((el) => ({
      label: el.featureset_name,
      value: el.featureset_uuid,
    }));
  };

  const statusOptions = [
    {
      label: "Active",
      value: 1,
    },
    {
      label: "Deactive",
      value: 2,
    },
  ];

  const ecuOptions = () => {
    const options =
      ecuData?.map((el) => ({
        label: el.device_id,
        value: el.device_id,
      })) || [];

    options.unshift({ label: "Unassign", value: "null" });
    return options;
  };

  const iotOptions = () => {
    const options =
      iotData?.map((el) => ({
        label: el.device_id,
        value: el.device_id,
      })) || [];

    options.unshift({ label: "Unassign", value: "null" });
    return options;
  };

  const dmsOptions = () => {
    const options =
      dmsData?.map((el) => ({
        label: el.device_id,
        value: el.device_id,
      })) || [];

    options.unshift({ label: "Unassign", value: "null" });
    return options;
  };

  const handleDevices = (e) => {
    const { name, value } = e.target;
    setDevices({ ...devices, [name]: value });
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-col-12 vehicle-card mb-6 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-150">
        <div className="card">
          <div className="card-header">
            <div className="p-text-bold">{`${item.vehicle_name} - ${item.vehicle_registration}`}</div>
          </div>
          <div className="card-body flex-grow">
            <div className="flex-col">
              <div className=" flex justify-around">
                <div>
                  <div>
                    <GiMineTruck
                      className="text-red-450 dark:text-red-550"
                      style={{
                        fontSize: "4rem",
                      }}
                    />
                  </div>
                </div>
                <div></div>
                <div className="p-grid">
                  <div className="p-col">
                    {item.ecu && <h1 className="p-text-bold">ECU:</h1>}
                    {item.iot && <h1 className="p-text-bold">IoT:</h1>}
                    {item.dms && <h1 className="p-text-bold">DMS:</h1>}
                    <h1 className="p-text-bold">Status:</h1>
                  </div>

                  <div className="p-col">
                    {item.ecu && <p>{item.ecu}</p>}
                    {item.iot && <p>{item.iot}</p>}
                    {item.dms && <p>{item.dms}</p>}
                    <Tag
                      value={item?.vehicle_status === 1 ? "Active" : "Deactive"}
                      severity={
                        item?.vehicle_status === 1 ? "success" : "danger"
                      }
                      rounded
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-card-footer mb-2">
            <div className="flex justify-center">
              {/* <Button
                icon="pi pi-map-marker"
                rounded
                outlined
                className="mr-2"
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                severity="info"
              /> */}
              <Button
                icon="pi pi-pencil"
                rounded
                tooltip="Edit"
                tooltipOptions={{ position: "mouse" }}
                className="mr-3 border border-gray-700 text-gray-700"
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => openEditDialog(item)}
              />
              <Button
                icon="pi pi-trash"
                rounded
                tooltip="Delete"
                tooltipOptions={{ position: "mouse" }}
                style={{ width: "2rem", height: "2rem" }}
                className="mr-3 border border-red-600 text-red-600"
                onClick={() => DeleteDialog(item)}
              />
              <Button
                icon="pi pi-eye"
                rounded
                tooltip="View"
                tooltipOptions={{ position: "mouse" }}
                className="border border-blue-500 text-blue-500 dark:text-blue-500"
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => ViewDialog(item)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="my-4 flex justify-end">
        <div className="justify-content-between align-items-center flex flex-wrap gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              className="searchbox w-[25vw] cursor-pointer rounded-full border py-3 pl-8 font-bold dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
      {/* GridView */}
      <DataView
        value={filteredData}
        layout="grid"
        itemTemplate={itemTemplate}
        paginator
        rows={6}
        emptyMessage="No vehicle found."
      />
      <p className="text-center text-gray-700">Total Items : {totalItems}</p>

      {/* Edit vehicle Data */}
      <Dialog
        visible={editDialog}
        onHide={closeEditDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Vehicle"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="vehicle_name"
                name="vehicle_name"
                onChange={handleChange}
                value={editData?.vehicle_name}
              />
              <label htmlFor="vehicle_name">Vehicle Name</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="vehicle_registration"
                name="vehicle_registration"
                onChange={handleChange}
                value={editData?.vehicle_registration}
              />
              <label htmlFor="vehicle_registration">Vehicle Registration</label>
            </span>
          </div>
          <div className="mx-auto mt-4 w-[34.5vw]">
            <small>Selected ECU</small>
            <p className="rounded-lg bg-gray-200 px-4 py-2">{editData.ecu}</p>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="ecu"
                name="ecu"
                options={ecuOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleDevices}
                value={devices?.ecu === null ? "Unassign" : devices?.ecu}
                className={`border dark:bg-gray-800 `}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select New ECU
              </label>
            </span>
          </div>
          <div className="mx-auto mt-4 w-[34.5vw]">
            <small>Selected IoT</small>
            <p className="rounded-lg bg-gray-200 px-4 py-2">{editData.iot}</p>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="iot"
                name="iot"
                options={iotOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleDevices}
                value={devices?.iot === null ? "Unassign" : devices?.ecu}
                className={`border dark:bg-gray-800 `}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select New IoT
              </label>
            </span>
          </div>
          <div className="mx-auto mt-4 w-[34.5vw]">
            <small>Selected IoT</small>
            <p className="rounded-lg bg-gray-200 px-4 py-2">{editData.dms}</p>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="dms"
                name="dms"
                options={dmsOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleDevices}
                value={devices?.dms === null ? "Unassign" : devices?.ecu}
                className={`border dark:bg-gray-800 `}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select New DMS
              </label>
            </span>
          </div>

          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="featureset"
                name="featureset_uuid"
                optionLabel="label"
                optionValue="value"
                options={featuresetOptions()}
                onChange={handleChange}
                value={editData?.featureset_uuid}
              />
              <label htmlFor="status">Select Featureset</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="vehicle_status"
                name="vehicle_status"
                optionLabel="label"
                optionValue="value"
                options={statusOptions}
                onChange={handleChange}
                value={editData?.vehicle_status}
              />
              <label htmlFor="status">Select Status</label>
            </span>
          </div>
          <div className="p-field p-col-12 mt-7 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </Dialog>
      {/* Delete vehicle Data */}
      <Dialog
        visible={deleteDialog}
        onHide={DeleteDialog}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={handleDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={DeleteDialog}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {deleteVehicleName}?</div>
      </Dialog>

      {/* ViewDialog */}
      <Dialog
        visible={viewDialog}
        onHide={closeViewDialog}
        header="View Page"
        style={{ width: "85vw" }}
      >
        <TabView>
          <TabPanel header="Vehicle's Trips" leftIcon="pi pi-truck mr-2">
            <VehicleTrips myData={myData} />
          </TabPanel>
          <TabPanel header="Feature Set" leftIcon="pi pi-cog mr-2">
            <FeatureSet myData={myData} closeDialog={closeViewDialog} />
          </TabPanel>
        </TabView>
      </Dialog>
    </div>
  );
}

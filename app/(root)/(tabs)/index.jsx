import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import OrderStatus from "../../../components/orderStatus";
import WidgetItem from "../../../components/widgetItem";
import CustomBarChart from "../../../components/barChart";
import InventoryList from "../../../components/inventoryList";
import TopTransactions from "../../../components/toptransactions";
import icons from "../../../constants/icons";

import { useState, useEffect } from "react";

const Spacer = ({ height = 10 }) => <View style={{ height }} />;

const url = "https://primebay-backend.onrender.com/api/v1/dashboard/app/stats";

export default function index() {
  // Define all the components to render
  const [loader, setLoader] = useState(true);
  const [count, setCount] = useState("");
  const [perc, setPerc] = useState("");
  const [chart, setChart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCount(data.stats.count);
        setPerc(data.stats.changePercent);
        setChart(data.stats.chart);
      } catch (error) {
        console.log("Error fetching data", error);
      }
      setLoader(false);
    };
    fetchData();
  }, []);

  const content = [
    { id: "orderStatus", component: <OrderStatus /> },
    {
      id: "widget1",
      component: (
        <WidgetItem
          heading="Revenue"
          value={count.revenue}
          percent={perc.revenue}
          color="#0000FF"
          amount={true}
        />
      ),
    },
    {
      id: "widget2",
      component: (
        <WidgetItem
          heading="Users"
          value={count.user}
          percent={perc.user}
          color="#009999"
          amount={true}
        />
      ),
    },
    {
      id: "widget3",
      component: (
        <WidgetItem
          heading="Transactions"
          value={count.order}
          percent={perc.order}
          color="#FFAA00"
          amount={true}
        />
      ),
    },
    {
      id: "widget4",
      component: (
        <WidgetItem
          heading="Products"
          value={count.product}
          percent={perc.product}
          color="#AA00AA"
          amount={true}
        />
      ),
    },
    {
      id: "divider1",
      component: (
        <View className="flex flex-col mt-10 border-t border-gray-300 pt-5" />
      ),
    },
    { id: "inventoryList", component: <InventoryList /> },
    {
      id: "divider2",
      component: (
        <View className="flex flex-col mt-10 border-t border-gray-300 pt-5" />
      ),
    },
    {
      id: "customBarChart",
      component: (
        <View>
          <CustomBarChart
            data_1={chart.revenue}
            data_2={chart.order}
            title_1="Revenue"
            title_2="Transaction"
            bgColor_1="#007bff"
            bgColor_2="#ff6347"
            horizontal={false}
          />
          <View className="px-6 bg-white w-full">
            <View className="flex flex-row items-center justify-start gap-14">
              <Text className="font-medium text-sm">Revenue </Text>
              <Image source={icons.bluecircle} className="size-5" />
            </View>
            <View className="flex flex-row items-center justify-start gap-8 mt-3">
              <Text className="font-medium text-sm">Transactions</Text>
              <Image source={icons.orangecircle} className="size-5" />
            </View>
          </View>
        </View>
      ),
    },
    {
      id: "divider3",
      component: (
        <View className="flex flex-col mt-10 border-t border-gray-300 pt-5" />
      ),
    },
    { id: "toptransactions", component: <TopTransactions /> },
    { id: "spacer", component: <Spacer height={100} /> },
  ];

  return !loader ? (
    <SafeAreaView className="bg-white h-full">
      <StatusBar barStyle="dark-content" />
      {/* FlatList replaces ScrollView */}
      <FlatList
        data={content}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <>{item.component}</>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  ) : (
    <View className="w-full h-full flex items-center justify-center mb-80">
      <ActivityIndicator size="200" color="#add8e6" />
    </View>
  );
}

// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   FlatList,
//   FlatListComponent,
// } from "react-native";
// import React from "react";
// import OrderStatus from "@/components/orderStatus";
// import WidgetItem from "@/components/widgetItem";
// import CustomBarChart from "@/components/barChart";
// import InventoryList from "@/components/inventoryList";
// import TopTransactions from "@/components/toptransactions";

// const Spacer = ({ height = 10 }) => <View style={{ height }} />;

// const index = () => {
//   return (
//     <SafeAreaView className="bg-white h-full">
//       <ScrollView nestedScrollEnabled={true}>
//         <OrderStatus />
//         <WidgetItem
//           heading={"Revenue"}
//           value={1804}
//           percent={100}
//           color={"#0000FF"}
//           amount={true}
//         />
//         <WidgetItem
//           heading={"Users"}
//           value={31}
//           percent={75}
//           color={"#009999"}
//           amount={true}
//         />
//         <WidgetItem
//           heading={"Transactions"}
//           value={22}
//           percent={50}
//           color={"#FFAA00"}
//           amount={true}
//         />
//         <WidgetItem
//           heading={"Products"}
//           value={138}
//           percent={25}
//           color={"#AA00AA"}
//           amount={true}
//         />

//         <View className="flex flex-col mt-10 border-t border-gray-300 pt-5"></View>
//         <InventoryList />
//         <View className="flex flex-col mt-10 border-t border-gray-300 pt-5"></View>

//         <TopTransactions />
//         <View className="flex flex-col mt-10 border-t border-gray-300 pt-5"></View>
//         <CustomBarChart
//           data_1={[12, 303, 834, 1923, 900, 210]}
//           data_2={[403, 54, 654, 628, 354, 434]}
//           title_1={"Revenue"}
//           title_2={"Transaction"}
//           bgColor_1={"#007bff"}
//           bgColor_2={"#ff6347"}
//           horizontal={false}
//           labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
//         />
//         <Spacer height={80} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default index;

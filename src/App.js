import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Code,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash } from "tabler-icons-react";

import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import axios from "axios";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/task")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  function createTask() {
    axios
      .post(process.env.REACT_APP_API_URL + "/task", {
        name: taskTitle.current.value,
        description: taskSummary.current.value,
      })
      .then((response) => {
        console.log(response.data);
        // Xử lý phản hồi thành công
      })
      .catch((error) => {
        console.error(error);
        // Xử lý lỗi
      });
    setTasks([
      ...tasks,
      {
        name: taskTitle.current.value,
        description: taskSummary.current.value,
      },
    ]);
  }

  function deleteTask(index, id) {
    var clonedTasks = [...tasks];

    clonedTasks.splice(index, 1);

    setTasks(clonedTasks);
    axios
      .delete(process.env.REACT_APP_API_URL + `/task/${id}`)
      .then((response) => {
        console.log(response.data);
        // Xử lý phản hồi thành công
      })
      .catch((error) => {
        console.error(error);
        // Xử lý lỗi
      });
  }
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Name"}
              required
              label={"Name"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Description"}
              label={"Description"}
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.name) {
                  return (
                    <Card withBorder key={index} mt={"sm"}>
                      <Group position={"apart"}>
                        <Text weight={"bold"}>{task.name}</Text>
                        <ActionIcon
                          onClick={() => {
                            deleteTask(index, task.id);
                          }}
                          color={"red"}
                          variant={"transparent"}
                        >
                          <Trash />
                        </ActionIcon>
                      </Group>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task.description
                          ? task.description
                          : "No description was provided for this task"}
                      </Text>
                    </Card>
                  );
                }
              })
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
